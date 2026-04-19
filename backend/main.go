package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

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
}

func initDB() {
	var err error
	// Connection string according to the docker container created
	connStr := "user=postgres password=postgres dbname=capsules sslmode=disable host=localhost"
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
		is_public BOOLEAN NOT NULL
	)`

	_, err = db.Exec(createTableQuery)
	if err != nil {
		log.Printf("Error creating table: %v\n", err)
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
		INSERT INTO capsules (title, content, release_date, collaborators, is_public) 
		VALUES ($1, $2, $3, $4, $5) RETURNING id`

	err = db.QueryRow(insertQuery, capsule.Title, capsule.Content, capsule.ReleaseDate, capsule.Collaborators, capsule.IsPublic).Scan(&capsule.ID)
	if err != nil {
		http.Error(w, "Failed to insert into database", http.StatusInternalServerError)
		log.Printf("Insert error: %v", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(capsule)
}

func getCapsules(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Filter by public only for feed
	rows, err := db.Query("SELECT id, title, content, release_date, collaborators, is_public FROM capsules WHERE is_public = true")
	if err != nil {
		http.Error(w, "Error fetching from database", http.StatusInternalServerError)
		log.Printf("Select error: %v", err)
		return
	}
	defer rows.Close()

	var capsules []Capsule
	for rows.Next() {
		var c Capsule
		if err := rows.Scan(&c.ID, &c.Title, &c.Content, &c.ReleaseDate, &c.Collaborators, &c.IsPublic); err != nil {
			continue
		}
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

	http.HandleFunc("/api/capsules", enableCORS(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			getCapsules(w, r)
		} else if r.Method == http.MethodPost {
			createCapsule(w, r)
		} else {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	}))

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("Server listening on port %s...\n", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
