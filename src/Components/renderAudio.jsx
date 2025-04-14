import React, { use, useEffect, useState } from 'react'
import './renderAudio.css'
import axios from 'axios';


const RenderAudio = ({ message }) => {
    const [audioData, setAudioData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [audioCache, setAudioCache] = useState({});

    // Function to fetch audio data
    const fetchAudioData = async (audioId) => {
        if (audioCache[audioId]) return audioCache[audioId]; // Return cached audio if available

        try {
            const response = await axios.get(`/api/audio/${audioId}`);
            const audioData = response.data.audio;
            setAudioCache(prev => ({ ...prev, [audioId]: audioData }));
            return audioData;
        } catch (error) {
            console.error("Error fetching audio:", error);
            return null;
            
        }
    };

    useEffect(() => {
        if (message.audioId) {
            setLoading(true);
            fetchAudioData(message.audioId).then(data => {
                setAudioData(data);
                setLoading(false);
            });
        } else if (message.audioData) {
            // For backward compatibility with existing messages
            setAudioData(message.audioData);
            setLoading(false);
        } else {
            setLoading(false);
        }
    }, [message.audioId, message.audioData]);

    if(loading) return <div className="loading">Loading audio...</div>;
    if (!audioData) return <div>Audio not available</div>;
    

  return (
    <div className="audio-player">
        <audio controls src={`data:audio/wav;base64,${audioData}`}>
            Your browser does not support the audio element.
        </audio>
    </div>
  );
};

export default RenderAudio;