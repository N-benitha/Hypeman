import groq from '../../groq';
import React from 'react'
import fs from "fs";
import path from "path";



const TTSComponent = () => {
    const speechFilePath = "speech.wav";
    const model = "playai-tts";
    const voice = "Fritz-PlayAI";
    const text = "I love building and shipping new features for our users!";
    const responseFormat = "wav";


    const tts = async () => {
        const response = await groq.audio.speech.create({
            model: model,
            voice: voice,
            input: text,
            response_format: responseFormat
          });
          
          const buffer = Buffer.from(await response.arrayBuffer());
          await fs.promises.writeFile(speechFilePath, buffer);
    }

  return (
    
    <div>TTSComponent</div>
  )
}

export default TTSComponent