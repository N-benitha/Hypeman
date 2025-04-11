  ![alt banner](HypeMan.png)

  ![GitHub last commit](https://img.shields.io/github/last-commit/N-benitha/Hypeman2)
  
Like every normal individual, I sometimes get imposter syndrome—heck, I had it the whole time while doing this project. I searched for motivation in all the places I could think of and sometimes fell short. This type of situation can prevent you from delivering what you are supposed to. HypeMan is a website for generating AI-powered speech content to motivate its users through tough times, like experiencing imposter syndrome, anxiety, or any other issue that hinders them from using their full potential. Everyone needs encouragement at some points in their life, and they may or may not get it. HypeMan has your back with personalized motivations that will help you get through those tough times.


![alt banner](chat1.png) ![alt banner](chat2.png)

Check out HypeMan [here](https://hypeman-7678f.web.app/)🔥!

## Overview

Hypeman API serves as the backend for the Hypeman platform, providing endpoints for AI-generated text content and text-to-speech conversion using Groq's LLM and TTS services. The application also integrates with Firebase Firestore to manage user chat history.

## Features

- 🤖 AI-powered text generation using Groq's LLaMa 3.3 70B model
- 🔊 Text-to-speech conversion with PlayAI TTS
- 🔥 Firebase integration for user data storage and retrieval
- 📖 Persistent Chat History

## Technologies

- Express.js
- Firebase Admin SDK
- Groq API (LLM & TTS)
- CORS support
- Dotenv for environment management
- React.js

## Data Flow in HypeMan Web Application

![alt banner](flow1.png) ![alt banner](flow2.png)

**Fig 1. Data Flow in Hypeman**

The diagram above illustrates the comprehensive flow of data through the HypeMan website. Here's a breakdown of the key processes:

### User Interaction Process

1. The user enters a prompt (how they're feeling) and selects a duration (1, 3, 5, or 10 minutes) in the React frontend
2. This request is sent to the Express backend API
3. The API verifies the user's authentication status with Firebase Auth

### Content Generation Process

4. The validated user prompt and a system message (defining HypeMan's role as a motivational coach) are sent to the Groq LLaMA 3.3 70B API
5. Groq returns the generated motivational text
6. This text is then sent to the Groq PlayAI TTS API
7. The TTS service returns the audio data as a binary response

### Storage Process

8. The system stores data in multiple locations:
    - User message text in Firestore
    - Audio data in Realtime Database (RTDB) due to size constraints
    - AI response text in Firestore

### Response Delivery Process

9. The backend returns both the text and audio data to the frontend

### Audio Playback Process

10. The frontend passes the audio data to the AudioPlayer component
11. The player first checks if the audio exists in the local cache
12. If not cached, it requests the audio by ID from the backend
13. The backend fetches the audio data from RTDB
14. The audio data is returned to the player
15. The player stores the audio in a cache for future use
16. Finally, the audio is played for the user

### Chat History Process

17. The UI requests chat history from the API
18. The API fetches message records from Firestore
19. Firestore returns the message history
20. The API returns the chat history to the UI

## API Endpoints

### Generate Text and Speech
```
POST /api/generate
```
Generates both text content and corresponding speech audio.

**Request Body:**
```json
{
  "prompt": "User input prompt",
  "systemPrompt": "System instructions",
  "duration": 1 
}
```

**Response:**
```json
{
  "text": "Generated text content",
  "audio": "Base64 encoded WAV audio"
}
```

### Create New Chat
```
POST /api/chats
```
Creates a new chat session for a user.

**Request Body:**
```json
{
  "userId": "user_unique_id",
  "title": "Chat Title" 
}
```

### Get User Chat History
```
GET /api/chats/:userId
```
Retrieves all chat sessions for a specific user.

## Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/hypeman.git
cd hypeman
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory with:
```
PORT=3000
CLIENT_URL=http://localhost:5173
GROQ_API_KEY=your_groq_api_key
```

4. Add Firebase service account key
Place your `service_account_key.json` file in the root directory.

## Running the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## Troubleshooting

If you encounter a "port in use" error:
```
Error: listen EADDRINUSE: address already in use :::3000
```

Either:
- Change the port in the `.env` file
- Find and terminate the process using port 3000:
  ```bash
  # Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  
  # macOS/Linux
  lsof -i :3000
  kill -9 <PID>
  ```

## Related projects

- [Calm](https://www.calm.com/)
- [HeadSpace](https://www.headspace.com/)

## License

[MIT LICENSE](https://github.com/N-benitha/Hypeman2/blob/7ab79c8ef6fd1ab4d8f19649ecf0286f7bd7077a/LICENSE)

## Contact

For support or inquiries, do not hesitate to contact me here.
[LinkeIn](https://www.linkedin.com/in/ngunga-benitha-26b43921b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app)
