import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { collection, deleteDoc, doc, getFirestore, onSnapshot, query } from 'firebase/firestore';
import './favorites.css';
import app from '../firebaseConfig';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const auth = getAuth(app);
    const db = getFirestore(app);

    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged(user => {
            if (!user) return;

            // subscribing to user's favorites
            const favoritesRef = collection(doc(db, "users", user.uid), "favorites");
            const favoritesQuery = query(favoritesRef, where("active", "==", true));

            const unsubscribeFavorites = onSnapshot(favoritesQuery, (snapshot) => {
                const favoritesData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt?.toDate() || new Date()
                }));
                setFavorites(favoritesData);
                setLoading(false);
            });

            return () => unsubscribeFavorites();
        });

        return () => unsubscribeAuth();
    }, []);

    const removeFavorite = async (favoriteId) => {
        if (!auth.currentUser) return;

        try {
            const favoriteRef = doc(db, "users", auth.currentUser.uid, "favorites", favoriteId);
            await deleteDoc(favoriteRef);
        } catch (error) {
            console.error("Error removing favorites:", error);
            
        }
    };

    // if (loading) {
    //     return <div className="loading">Loading favorites...</div>
    // }


  return (
    <div className="favorites-container">
        <h2>Your Favorite Motivations</h2>

        {favorites.length === 0 ? (
            <div className="no-favorites">
                You don't have any saved favorites yet. Click the heart icon on any message to save it here.
            </div>
        ) : (
            <div className="favorites-list">
                {favorites.map(favorite => (
                    <div key={favorite.id} className="favorite-item">
                        <div className="favorite-content">{favorite.content}</div>
                        <div className="favorite-audio">
                            <audio controls src={favorite.audioUrl}>
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                        <button className='remove-favorite' onClick={() => removeFavorite(favorite.id)}>
                            <FontAwesomeIcon icon={faHeart}></FontAwesomeIcon>
                        </button>
                    </div>
                ))}
            </div>
        )}
    </div>
  );
};

export default Favorites;