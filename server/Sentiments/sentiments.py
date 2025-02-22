# sentiments.py
from textblob import TextBlob
import sys
import json

# Simple emotion lexicon (expand this as needed)
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
    
    filtered_emotions = {emotion: score for emotion, score in emotions.items() if score > 0}
    return filtered_emotions

def analysis(text):
    detailed_scores = []
    blob = TextBlob(text)
    sentences = blob.sentences
    
    for sentence in sentences:
        scores = {
            "polarity": sentence.sentiment.polarity,
            "subjectivity": sentence.sentiment.subjectivity,
            "emotions": analyze_emotions(str(sentence))
        }
        detailed_scores.append({"sentence": str(sentence), "scores": scores})
    
    # Overall scores
    overall_scores = {
        "polarity": blob.sentiment.polarity,
        "subjectivity": blob.sentiment.subjectivity,
        "emotions": analyze_emotions(text)
    }
    
    result = {
        "overall": overall_scores,
        "by_sentence": detailed_scores
    }
    return result

if __name__ == "__main__":
    try:
        text = sys.argv[1]  
        result = analysis(text)
        print(json.dumps(result))  
    except IndexError:
        print(json.dumps({"error": "No text provided"}))
    except Exception as e:
        print(json.dumps({"error": str(e)}))