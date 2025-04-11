import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './chatList.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
// import { faSquarePen } from "@fortawesome/free-regular-svg-icons";
import { getAuth } from 'firebase/auth';
import { addDoc, collection, doc, getFirestore, onSnapshot, serverTimestamp, query, orderBy } from 'firebase/firestore';
import app from '../firebaseConfig';


const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth(app);
  const db = getFirestore(app);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(user => {
      if (!user) {
        navigate('/login');
        return;
      }

      // subscribe to user's chats
      const chatsRef = collection(doc(db, "users", user.uid), "chats");
      const chatsQuery = query(chatsRef, orderBy("createdAt", "desc"));

      const unsubscribeChats = onSnapshot(chatsQuery, (snapshot) => {
        const chatsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        }));
        setChats(chatsData);
        setLoading(false);
      });

      return () => unsubscribeChats();

    });

    return () => unsubscribeAuth();
  }, [navigate]);

  const createNewChat = async () => {
    if (!auth.currentUser) return;

    try {
      const newChat = {
        title: "New Chat",
        createdAt: serverTimestamp()
      };

      const chatsRef = collection(doc(db, "users", auth.currentUser.uid), "chats");
      const docRef = await addDoc(chatsRef, newChat);

      // navigating to new chat
      navigate(`/dashboard/chats?id=${docRef.id}`);

    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  // if (loading) {
  //   return <div className="loading">Loading chats...</div>;
  // }

  return (
    <div className="chatList">
        <span className='title'>DASHBOARD</span>
        <button className='new-chat-btn' onClick={createNewChat}>
          <FontAwesomeIcon icon={faPenToSquare}></FontAwesomeIcon> New Chat
        </button>
        <Link to={'/dashboard/favorites'}>Favorites</Link>
        <Link to={'/'}>Contact</Link>

        <hr />
        <span className='title'>RECENT CHATS</span>
        <div className="chats-container">
            {chats.length === 0 ? (
              <div className="no-chats">No chats yet.</div>
            ) : (
              chats.map(chat => (
                <Link key={chat.id} to={`/dashboard/chats?id=${chat.id}`} className='chat-item'>
                  <div className="chat-title">{chat.title || "Untitled Chat"}</div>
                  <div className="chat-date">
                    {chat.createdAt.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </Link>
              ))
            )}
        </div>

        <hr />
        <div className="upgrade">
          <img src="#" alt="logo" />
          <div className="texts">
            <span>Upgrade to HypeMan Pro</span>
            <span>Get unlimited access to all features</span>
          </div>
        </div>
    </div>
  )
}

export default ChatList;