from flask import Flask, request, jsonify
import sqlite3
import os
from textblob import TextBlob
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})  # Match React dev server

# Emotion lexicon (from your original code)
emotion_lexicon = {
    "love": {"happy": 0.9, "trust": 0.6},
    "great": {"happy": 0.8},
    "terrible": {"sad": 0.7, "anger": 0.5},
    "hate": {"anger": 0.9, "sad": 0.4},
    "okay": {"neutral": 0.6},
    "awful": {"sad": 0.8, "disgust": 0.5},
    "amazing": {"happy": 0.9, "surprise": 0.4},
    "fear": {"fear": 0.9},
    "scared": {"fear": 0.8},
    "angry": {"anger": 0.9}
}

# Database setup
DB_PATH = os.path.join(os.path.dirname(__file__), "capsules.db")

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS capsules (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            release_date TEXT NOT NULL,
            collaborators TEXT,
            is_public BOOLEAN NOT NULL,
            hash TEXT NOT NULL,
            media_path TEXT,
            sentiment TEXT,
            polarity REAL,
            subjectivity REAL,
            emotions TEXT
        )
    ''')
    conn.commit()
    conn.close()

# Sentiment and emotion analysis functions (from your original code)
def analyze_emotions(text):
    blob = TextBlob(text)
    words = blob.words.lower()
    emotions = {"happy": 0.0, "sad": 0.0, "anger": 0.0, "fear": 0.0, "trust": 0.0, "surprise": 0.0, "disgust": 0.0, "neutral": 0.0}
    for word in words:
        if word in emotion_lexicon:
            for emotion, score in emotion_lexicon[word].items():
                emotions[emotion] += score
    word_count = max(len(words), 1)
    for emotion in emotions:
        emotions[emotion] /= word_count
    return {e: s for e, s in emotions.items() if s > 0}

def analyze_text(text):
    blob = TextBlob(text)
    sentences = blob.sentences
    detailed_scores = [
        {"sentence": str(s), "scores": {
            "polarity": s.sentiment.polarity,
            "subjectivity": s.sentiment.subjectivity,
            "emotions": analyze_emotions(str(s))
        }} for s in sentences
    ]
    overall_scores = {
        "polarity": blob.sentiment.polarity,
        "subjectivity": blob.sentiment.subjectivity,
        "emotions": analyze_emotions(text)
    }
    return {"overall": overall_scores, "by_sentence": detailed_scores}

# Helper to get DB connection
def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    return conn

# API endpoint for creating capsules
@app.route("/api/capsules", methods=["POST"])
def create_capsule():
    try:
        # Extract form data
        title = request.form.get("title")
        content = request.form.get("content")
        release_date = request.form.get("releaseDate")
        collaborators = request.form.get("collaborators")
        is_public = request.form.get("isPublic") == "true"
        capsule_hash = request.form.get("hash")
        media = request.files.get("media")

        # Validate required fields
        if not all([title, content, release_date, capsule_hash]):
            return jsonify({"error": "Missing required fields"}), 400

        # Perform sentiment analysis on content
        sentiment_result = analyze_text(content)
        overall_sentiment = sentiment_result["overall"]
        emotions = overall_sentiment["emotions"]

        # Handle media file (save to a directory)
        media_path = None
        if media:
            upload_dir = os.path.join(os.path.dirname(__file__), "uploads")
            os.makedirs(upload_dir, exist_ok=True)
            media_path = os.path.join(upload_dir, media.filename)
            media.save(media_path)

        # Store in database
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO capsules (title, content, release_date, collaborators, is_public, hash, media_path, sentiment, polarity, subjectivity, emotions)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (title, content, release_date, collaborators, is_public, capsule_hash, media_path,
              str(overall_sentiment), overall_sentiment["polarity"], overall_sentiment["subjectivity"], str(emotions)))
        conn.commit()
        capsule_id = cursor.lastrowid
        conn.close()

        # Response
        return jsonify({
            "message": "Capsule created successfully",
            "capsule_id": capsule_id,
            "hash": capsule_hash,
            "sentiment": sentiment_result
        }), 201

    except Exception as e:
        return jsonify({"error": f"Failed to create capsule: {str(e)}"}), 500

# Optional: Health check endpoint
@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy"}), 200

if __name__ == "__main__":
    init_db()
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=os.environ.get("FLASK_ENV") == "development")