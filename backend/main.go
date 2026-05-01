package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	_ "github.com/lib/pq"
)

// DB connection
var db *sql.DB

// Capsule represents a time capsule
type Capsule struct {
	ID            int    `json:"id"`
	Title         string `json:"title"`
	Content       string `json:"content"`
	ReleaseDate   string `json:"releaseDate"`
	Collaborators string `json:"collaborators"`
	IsPublic      bool   `json:"isPublic"`
	ImageURL      string `json:"imageUrl"`
	CreatedAt     string `json:"createdAt"`
}

func initDB() {
	var err error
	connStr := os.Getenv("DATABASE_URL")
	if connStr == "" {
		connStr = "user=postgres password=postgres dbname=capsules sslmode=disable host=localhost"
	}
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}

	err = db.Ping()
	if err != nil {
		log.Printf("Warning: Unable to connect to database: %v\n", err)
	} else {
		fmt.Println("Successfully connected to database!")
	}

	createTableQuery := `
	CREATE TABLE IF NOT EXISTS capsules (
		id SERIAL PRIMARY KEY,
		title TEXT NOT NULL,
		content TEXT NOT NULL,
		release_date TEXT NOT NULL,
		collaborators TEXT,
		is_public BOOLEAN NOT NULL,
		image_url TEXT DEFAULT '',
		created_at TIMESTAMP DEFAULT NOW()
	)`

	_, err = db.Exec(createTableQuery)
	if err != nil {
		log.Printf("Error creating table: %v\n", err)
	}

	// Auto-migrate: add columns if they don't exist (for existing databases)
	migrations := []string{
		"ALTER TABLE capsules ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT ''",
		"ALTER TABLE capsules ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW()",
	}
	for _, m := range migrations {
		_, err = db.Exec(m)
		if err != nil {
			log.Printf("Migration warning: %v\n", err)
		}
	}
}

// CORS header middleware
func enableCORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*") // For development
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next(w, r)
	}
}

func uploadImage(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// 10 MB max
	r.ParseMultipartForm(10 << 20)

	file, handler, err := r.FormFile("image")
	if err != nil {
		http.Error(w, "Error reading uploaded file", http.StatusBadRequest)
		log.Printf("Upload error: %v", err)
		return
	}
	defer file.Close()

	// Validate file type
	ext := strings.ToLower(filepath.Ext(handler.Filename))
	allowed := map[string]bool{".jpg": true, ".jpeg": true, ".png": true, ".gif": true, ".webp": true}
	if !allowed[ext] {
		http.Error(w, "File type not allowed. Use jpg, png, gif, or webp.", http.StatusBadRequest)
		return
	}

	// Create uploads directory if it doesn't exist
	uploadsDir := "./uploads"
	if err := os.MkdirAll(uploadsDir, os.ModePerm); err != nil {
		http.Error(w, "Server error", http.StatusInternalServerError)
		log.Printf("Mkdir error: %v", err)
		return
	}

	// Generate unique filename
	filename := fmt.Sprintf("%d_%s", time.Now().UnixNano(), handler.Filename)
	filename = strings.ReplaceAll(filename, " ", "_")
	destPath := filepath.Join(uploadsDir, filename)

	dst, err := os.Create(destPath)
	if err != nil {
		http.Error(w, "Server error", http.StatusInternalServerError)
		log.Printf("File create error: %v", err)
		return
	}
	defer dst.Close()

	if _, err := io.Copy(dst, file); err != nil {
		http.Error(w, "Server error", http.StatusInternalServerError)
		log.Printf("File copy error: %v", err)
		return
	}

	// Return the URL path to access this file
	imageURL := fmt.Sprintf("/uploads/%s", filename)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"imageUrl": imageURL})
}

func createCapsule(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var capsule Capsule
	err := json.NewDecoder(r.Body).Decode(&capsule)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	insertQuery := `
		INSERT INTO capsules (title, content, release_date, collaborators, is_public, image_url) 
		VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, created_at`

	var createdAt time.Time
	err = db.QueryRow(insertQuery, capsule.Title, capsule.Content, capsule.ReleaseDate, capsule.Collaborators, capsule.IsPublic, capsule.ImageURL).Scan(&capsule.ID, &createdAt)
	if err != nil {
		http.Error(w, "Failed to insert into database", http.StatusInternalServerError)
		log.Printf("Insert error: %v", err)
		return
	}
	capsule.CreatedAt = createdAt.Format(time.RFC3339)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(capsule)
}

func getCapsules(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Check for filter query param
	filter := r.URL.Query().Get("filter")

	var query string
	if filter == "public" {
		query = "SELECT id, title, content, release_date, collaborators, is_public, COALESCE(image_url, ''), COALESCE(created_at, NOW()) FROM capsules WHERE is_public = true ORDER BY created_at DESC"
	} else {
		// Return all capsules (for Vault / personal view)
		query = "SELECT id, title, content, release_date, collaborators, is_public, COALESCE(image_url, ''), COALESCE(created_at, NOW()) FROM capsules ORDER BY created_at DESC"
	}

	rows, err := db.Query(query)
	if err != nil {
		http.Error(w, "Error fetching from database", http.StatusInternalServerError)
		log.Printf("Select error: %v", err)
		return
	}
	defer rows.Close()

	var capsules []Capsule
	for rows.Next() {
		var c Capsule
		var createdAt time.Time
		if err := rows.Scan(&c.ID, &c.Title, &c.Content, &c.ReleaseDate, &c.Collaborators, &c.IsPublic, &c.ImageURL, &createdAt); err != nil {
			log.Printf("Scan error: %v", err)
			continue
		}
		c.CreatedAt = createdAt.Format(time.RFC3339)
		capsules = append(capsules, c)
	}

	if capsules == nil {
		capsules = []Capsule{}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(capsules)
}

func main() {
	initDB()

	// Create uploads directory
	os.MkdirAll("./uploads", os.ModePerm)

	http.HandleFunc("/api/capsules", enableCORS(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			getCapsules(w, r)
		} else if r.Method == http.MethodPost {
			createCapsule(w, r)
		} else {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	}))

	http.HandleFunc("/api/upload", enableCORS(uploadImage))

	// Serve uploaded files
	fs := http.StripPrefix("/uploads/", http.FileServer(http.Dir("./uploads")))
	http.HandleFunc("/uploads/", enableCORS(func(w http.ResponseWriter, r *http.Request) {
		fs.ServeHTTP(w, r)
	}))

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("Server listening on port %s...\n", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
