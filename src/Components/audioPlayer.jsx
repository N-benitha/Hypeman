import React, { useEffect, useRef } from 'react';
import './audioPlayer.css';

const AudioPlayer = ({ audioBase64, duration }) => {
    const audioRef = useRef(null);

    useEffect(() => {
        if (audioBase64 && audioRef.current) {
            // Creating audio source from base64
            const audioSrc = `data:audio/wav;base64,${audioBase64}`;
            audioRef.current.src = audioSrc;
        }
    }, [audioBase64]);

  return (
    <div className="audio-player">
        <audio ref={audioRef} controls>
            Your browser does not support the audio element.
        </audio>
        <div className="duration-label">{duration} min</div>
    </div>
  );
};

export default AudioPlayer;