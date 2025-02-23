# TimeCapsule

Welcome to **TimeCapsule**, a digital platform designed to preserve memories, messages, and moments for the future. With TimeCapsule, users can create virtual capsules, lock them with a future unlock date, and share them with loved ones. Enhanced with blockchain technology for security and sentiment analysis for deeper insights, this project blends nostalgia with cutting-edge innovation.

## Features

- **Create Capsules**: Store text, images, videos, or other files in a digital time capsule.
- **Set Unlock Dates**: Choose when your capsule can be opened—days, months, or years into the future.
- **Share with Others**: Invite friends or family to contribute or view capsules when they unlock.
- **Blockchain Security**: Ensure tamper-proof storage and authenticity using decentralized technology.
- **Sentiment Analysis**: Gain insights into the emotions behind your capsule’s contents.
- **Cross-Platform**: Accessible via web, with plans for mobile support.

## Usage 
# TimeCapsule

<!-- Introductory content could go here, e.g., a brief project description -->

## Running the Application

Once set up, the app will be available at `http://localhost:3000` (or your configured port). Follow the installation instructions [elsewhere in the README] to get started.

## Usage

Here’s how to interact with TimeCapsule:

### Create a Capsule
- Navigate to the "New Capsule" page in the app.
- Upload your content (e.g., text, images, or videos) and set an unlock date.
- Optionally, invite collaborators by entering their email or wallet address.

### Blockchain Verification
- When you save your capsule, its metadata is automatically hashed and stored on the blockchain, ensuring immutability and authenticity.

### Sentiment Insights
- Analyze your text entries to receive a breakdown of emotions (e.g., joy, nostalgia, sadness) before sealing the capsule.

### Open a Capsule
- Once the unlock date arrives, return to the app to access your capsule and relive your preserved memories.

<!-- Additional sections like Installation, Contributing, etc., could follow -->

## Sentiment Analysis

TimeCapsule includes an optional sentiment analysis feature to interpret the emotions in your text-based capsule entries.

- **Technology**: Powered by [Natural Language Processing (NLP)] using Python’s [VADER](https://github.com/cjhutto/vaderSentiment) or a custom model.
- **Output**: Each text entry receives a sentiment score (positive, neutral, negative) and an emotional breakdown (e.g., happiness, sadness).
- **Use Case**: Reflect on the tone of your memories or track emotional trends over time.

  
 ## Blockchain Integeration
Users metadata will be stored in a hash reinforced with SHA 256 algorithm  providing an extra layer of encryption resulting in increades security

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A blockchain wallet (e.g., [MetaMask](https://metamask.io/)) for testing blockchain features
- Python (v3.8+) for sentiment analysis (optional, see Sentiment Analysis section)

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Shardz4/TimeCapsule.git
   cd TimeCapsule
