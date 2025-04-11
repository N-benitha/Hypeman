import React, { useEffect, useState } from 'react';
import './chatPage.css';
import { useRef } from 'react';
import NewPrompt from './newPrompt';
import { getAuth } from 'firebase/auth';
import app from '../firebaseConfig';
import { getFirestore, collection, query, orderBy, onSnapshot, doc, serverTimestamp, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import AudioPlayer from './audioPlayer';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentChat, setCurrentChat] = useState(null);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Auto-scroll to bottom when messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged( async (user) => {
      if (!user) return;
      
      // get chatId from URL or create one if none exits
      let chatId = new URLSearchParams(window.location.search).get('id');

      // if no chatId is given, create one
      if (!chatId) {
        try {
          const newChat = {
            title: "New Chat",
            createdAt: serverTimestamp()
          };

          const chatsRef = collection(doc(db, "users", user.uid), "chats");
          const docRef = await addDoc(chatsRef, newChat);

          // update URL with the new chat ID
          chatId = docRef.id;
          navigate(`/dashboard/chats/?id=${chatId}`);

        } catch (error) {
          console.error("Error creating new chat:", error);
          return;
        }
      }

      setCurrentChat(chatId);

      // now fetch messages for this chat
      const messagesRef = collection(doc(db, "users", user.uid, "chats", chatId), "messages");
      const messagesQuery = query(messagesRef, orderBy("createdAt", "asc"));

      const unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
        const messagesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        }));

        // ensure we don't have duplicates before setting the state
        const uniqueMessages = [];
        const messageIds = new Set();

        messagesData.forEach(message => {
          if (!messageIds.has(message.id)) {
            messageIds.add(message.id);
            uniqueMessages.push(message);
          }
        });

        setMessages(uniqueMessages);
        setLoading(false);
      });

      return () => unsubscribeMessages();
    });

    return () => unsubscribeAuth();
  }, [db, navigate]);

  const handleNewMessage = (newMessage) => {
    // check if message already exists
    if (!messages.some(msg => msg.id === newMessage.id)) {
      setMessages(prevMessages => [...prevMessages, newMessage]);
    } else {
      // if it exits, update it instead of adding a new one
      setMessages(prevMessages => prevMessages.map(msg => msg.id === newMessage.id ? { ...msg, ...newMessage } : msg));
    }
  };

  const renderMessage = (message) => {
    // for user message, always show the content
    if (message.sender === 'user') {
      return <div className="message user-message">{message.content}</div>;
    }
    // for AI messages, only show the audio player if available
    if (message.audioData || message.audioId) {
      return <AudioPlayer audioId={message.audioId} audioData={message.audioData} />;
    }

    // fallback for ai messages without audio
    return <div className="message ai-message">{message.content}</div>;
  }

  return (
    <div className="chatPage">
        <div className="wrapper">
            <div className="chat">
                {loading ? (
                  <div className="loading">Loading messages...</div>
                ) : (
                  <>
                    {messages.length === 0 ? (
                      <div className="empty-chat">
                        <p>Start a new conversation with HypeMan!</p>
                      </div>
                    ) : (
                      messages.map(message => (
                        <div key={message.id} className={`message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}>
                          {renderMessage(message)}
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </>
                )}
                {currentChat && (
                  <NewPrompt onSendMessage={handleNewMessage} chatId={currentChat}/>                  
                )}
                
            </div>

        </div>
    </div>
  );
};

export default ChatPage;