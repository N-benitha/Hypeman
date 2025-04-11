import React, { useEffect, useRef, useState } from 'react';
import './audioPlayer.css';
import axios from 'axios';

const AudioPlayer = ({ audioId, audioData }) => {
    const [audio, setAudio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [audioCache, setAudioCache] = useState({});

    // Function to fetch audio data
    const fetchAudioData = async (audioId) => {
        if (audioCache[audioId]) return audioCache[audioId]; // return cached audio if available

        try {
            const response = await axios.get(`/api/audio/${audioId}`);
            if (response.data && response.data.audio) {
                const fetchedAudio = response.data.audio;
                setAudioCache(prev => ({ ...prev, [audioId]: fetchedAudio }));
                return fetchedAudio;
            } else {
                throw new Error("Invalid audio data received");
            }
            
        } catch (error) {
            console.error("Error fetching audio:", error);
            throw error
            
        }
    };

    useEffect(() => {
        // reset state for new props
        setError(null);

        // if we already have audio data from props, use that
        if (audioData) {
            setAudio(audioData);
            setLoading(false);
            return;
        }

        // otherwise, fetch audio using the ID
        if (audioId) {
            setLoading(true);
            fetchAudioData(audioId).then(data => {
                setAudio(data);
                setLoading(false);
            }).catch(err => {
                setError("Failed to load audio");
                setLoading(false);
            });
        } else {
            setError("No audio source provided");
            setLoading(false);
        }
        
    }, [audioId, audioData]);

    if (loading) return <div className="loading">Loading audio...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!audio) return <div>Audio unavailable</div>;

  return (
    <div className='audio-player'>
        <audio controls src={`data:audio/wav;base64,${audio}`}>
        Your browser does not support the audio element.
        </audio>
    </div>
    
  );
};

export default AudioPlayer;