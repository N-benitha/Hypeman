import express from "express";
import cors from "cors";
import { createRequire } from 'module';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();
const port = process.env.PORT || 3000;
const app = express();

let admin;

// middleware for CORS
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
}));

app.use(express.json());

// Initializing Firebase Admin SDK
const connect = async () => {

    const require = createRequire(import.meta.url);
    admin = require("firebase-admin");
    var serviceAccount = require("./service_account_key.json");

    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://hypeman-7678f-default-rtdb.europe-west1.firebasedatabase.app",
      });
  
      console.log("Connected to Firebase Firestore");
      return true;
    } catch (err) {
      console.error("Firebase connection error:", err);
      return false;
    }
  };

// Health check endpoint
app.get("/test", (req, res) => {
    res.send("Hypeman API is running!");
});


// Generate text and speech
app.post("/api/generate", async (req, res) => {
  try {
    if (!admin) {
      return res.status(500).json({ error: "Firebase Admin SDK not initialized"});
    }
    const { prompt, systemPrompt, duration } = req.body;

    // calling Groq API for text generation
    const groqResponse = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        max_tokens: duration * 150,
        temperature: 0.7
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const generatedText = groqResponse.data.choices[0].message.content;

    // calling TTS API to generate speech
    const ttsResponse = await axios.post(
      "https://api.groq.com/openai/v1/audio/speech",
      {
        model: "playai-tts",
        voice: "Cheyenne-PlayAI",
        input: generatedText,
        response_format: "wav"
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        responseType: 'arraybuffer'
      }
    );
  
    console.log("Audio generated successfully, size:", ttsResponse.data.length);

    // converting audio to base64 for front-end
    const audioBase64 = Buffer.from(ttsResponse.data).toString('base64');

    // generating a unique ID for the audio
    const audioId=`audio_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // storing the audio data in Realtime Database
    const db = admin.database();
    await db.ref(`audio/${audioId}`). set({
      data: audioBase64,
      createdAt: admin.database.ServerValue.TIMESTAMP
    });

    console.log("Audio stored in RTDB with ID:", audioId);
    

    // returning both audio and text
    res.json({
      text: generatedText,
      audio: audioBase64, // for immediate playback
      audioId: audioId // for retrieval from RTDB later
    });

  } catch (error) {
    console.error("Error generating content:", error.response?.data || error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
    res.status(500).json({ error: "Failed to generate content", details: error.response?.data || error.message });
    
  }
});

// endpoint to retrieve audio
app.get("/api/audio/:audioId", async (req, res) => {
  try {
    if (!admin) {
      return res.status(500).json({ error: "Firebase Admin SDK not initialized"});
    }

    // getting the audio ID from the request parameters
    const { audioId } = req.params;
    const db = admin.database();
    const audioSnapshot = await db.ref(`audio/${audioId}`).once('value');
    const audioData = audioSnapshot.val();

    if (!audioData || !audioData.data) {
      return res.status(404).json({ error: "Audio not found" });
    }

    res.json({ audio: audioData.data });
  } catch (error) {
    console.error("Error retrieving the audio:", error);
    res.status(500).json({ error: "Failed to retrieve audio" });
    
  }
});


// Creating a new chat
app.post("/api/chats", async (req, res) => {
  try {
    if (!admin) {
      return res.status(500).json({ error: "Firebase Admin SDK not initialized"});
    }

    // getting the user ID and title from the request body
    const { userId, title } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const db = admin.firestore();
    const chatRef = await db.collection("users").doc(userId).collection("chats").add({
      title: title || "New Chat",
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(201).json({ id: chatRef.id })
  } catch (error) {
    console.error("Error creating chat:", error);
    res.status(500).json({ error: "Failed to create chat" });
    
  }
  
});


// getting user's history 
app.get("/api/chats/:userId", async (req, res) => {
  try {
    if (!admin) {
      return res.status(500).json({ error: "Firebase Admin SDK not initialized"});
    }

    // getting the user ID from the request parameters
    const { userId } = req.params;
    const db = admin.firestore();
    const chatsSnapshot = await db.collection("users").doc(userId).collection("chats").orderBy("createdAt", "desc").get();

    const chats = [];
    chatsSnapshot.forEach(doc => {
      chats.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json(chats);

  } catch (error) {
      console.error("Error fetching chats:", error);
      res.status(500).json({ error: "Failed to fetch chats" });
      
  }
});

// starting the server
app.listen(port, async () => {
  // await connect();
  // console.log(`Hypeman server is running on port ${port}`);
    try {
      const connected = await connect();
      if (connected) {
        console.log(`Hypeman server is running on port ${port}`);
      } else {
        console.error("Server started but Firebase connection failed");
      } 
    } catch (error) {
      console.error("Error starting server:", error);
      
    }
    
});
