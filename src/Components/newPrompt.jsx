import React, { useRef, useEffect, useState } from 'react'
import './newPrompt.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faHeart } from "@fortawesome/free-solid-svg-icons";
// import {faHeart} from "@fortawesome/free-regular-svg-icons";
import { getAuth } from 'firebase/auth';
import app from '../firebaseConfig';
import { addDoc, collection, doc, getFirestore, serverTimestamp } from 'firebase/firestore';
import axios from 'axios';
import AudioPlayer from './audioPlayer';

const NewPrompt = ({ onSendMessage, chatId }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [selectedDuration, setSelectedDuration] = useState(1);
    const [currentAudioBase64, setCurrentAudioBase64] = useState(null);
    const [currentAudioId, setCurrentAudioId] = useState(null);
    const [currentDuration, setCurrentDuration] = useState(null);
    const [error, setError] = useState(null);
    const inputRef = useRef(null);
    const auth = getAuth(app);
    const db = getFirestore(app);


    const handleSubmit = async (e) => {
        e.preventDefault();
        const text = inputRef.current.value.trim();

        // clear any previous errors 
        setError(null);

        // validate inputs and state
        if (!text) {
          setError("Please enter a message");
          return;
        }

        if (isLoading) return;

        if (!auth.currentUser) {
          setError("You must be logged in");
          return;
        }

        if (!chatId) {
          setError("No active chat selected");
          return;
        }

        setIsLoading(true);
        try {
          const user = auth.currentUser;
          const userMessage ={
            content: text,
            sender: 'user',
            createdAt:serverTimestamp(),
            type: 'text'
          };

          // create the message reference using the chatId prop
          const messagesRef = collection(doc(db, "users", user.uid, "chats", chatId), "messages");
          const userMessageDoc = await addDoc(messagesRef, userMessage);

          // call the onSendMessage callback with the new message
          if (typeof onSendMessage === 'function') {
            onSendMessage({
              id: userMessageDoc.id,
              ...userMessage,
              createdAt: new Date()
            });
          }

          inputRef.current.value = '';

          setCurrentAudioBase64(null);
          setCurrentAudioId(null);

          const systemPrompt = `You are a motivational coach called Hypeman. Your goal is to provide encouragement and motivation to help people overcome challenges like imposter syndrome, anxiety, or tough workouts. Keep your response concise but powerful, suitable for a ${selectedDuration}-minute audio recording.`;

          const response = await axios.post('/api/generate', {
            prompt: text,
            systemPrompt,
            duration: selectedDuration
          });

          const aiContent = response.data.text;
          const audioBase64 = response.data.audio;
          const audioId = response.data.audioId;

          // set the current audio for immediate playback
          setCurrentAudioBase64(audioBase64);
          setCurrentAudioId(audioId);
          setCurrentDuration(selectedDuration);

          const aiMessage = {
            content: aiContent,
            sender: 'ai',
            createdAt: serverTimestamp(),
            type: 'text',
            audioId: audioId,
            duration: selectedDuration
          };

          const aiMessageDoc = await addDoc(messagesRef, aiMessage);

          // for immediate display, send both text and audio to the handler
          if (typeof onSendMessage === 'function') {
            onSendMessage({
              id: aiMessageDoc.id,
              ...aiMessage,
              audioData: audioBase64,
              createdAt: new Date()
            });  
          }
          
        } catch (error) {
          console.error("Error processing message:", error);
          console.error("Error details:", error.response?.data);
          console.error("Error status:", error.response?.status);
          setError("Failed to send message please try again.");
          
        } finally {
          setIsLoading(false);
        }
    }

  return (
    <>
      <div className='prompt-container'>
          {error && <div className='error-message'>{error}</div>}
          <form className='newForm' onSubmit={handleSubmit}>
              <select className="duration-select" value={selectedDuration} onChange={(e) => setSelectedDuration(Number(e.target.value))}>
                      <option value="1">35 sec</option>
                      <option value="3">3 min</option>
                      <option value="5">5 min</option>
                      <option value="10">10 min</option>
              </select>
              <input ref={inputRef} type="text" name="text" placeholder='How are you feeling today?' disabled={isLoading} />
              <button type='submit' disabled={isLoading}>
                  <FontAwesomeIcon icon={faArrowUp} style={{color:'white'}}/>
              </button>
              <button type='button'>
                  <FontAwesomeIcon icon={faHeart} />
              </button>
          </form>
          {isLoading && <div className='loading-indicator'>Generating your motivation...</div>}
      </div>
    </>
  );
};

export default NewPrompt;