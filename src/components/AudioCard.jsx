import React, { useRef, useState, useMemo } from 'react';
import Draggable from 'react-draggable';
import { Play, Square, Disc, Mic, Square as StopSquare } from 'lucide-react';

const AudioCard = ({ defaultPosition, title }) => {
  const nodeRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(title);
  
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const rotation = useMemo(() => Math.random() * 6 - 3, []);
  const tapeColor = useMemo(() => ['washi-pink', 'washi-blue', 'washi-green'][Math.floor(Math.random() * 3)], []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop()); // Stop mic
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Please allow microphone access to record voice notes.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const togglePlay = () => {
    if (!audioUrl) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  return (
    <Draggable nodeRef={nodeRef} defaultPosition={defaultPosition} bounds="parent" cancel="input, button">
      <div 
        ref={nodeRef} 
        className="board-item media-card drag-handle"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <div className={`washi-tape ${tapeColor}`}></div>
        <div className="audio-header">
          <Disc className={`disc-icon ${playing ? 'spinning' : ''}`} size={32} />
          <input 
            value={currentTitle} 
            onChange={(e) => setCurrentTitle(e.target.value)} 
            placeholder="Audio title..."
            className="media-title-input"
          />
        </div>
        <div className="media-controls">
          {!audioUrl ? (
            <button 
              onClick={isRecording ? stopRecording : startRecording} 
              className={`record-btn ${isRecording ? 'recording' : ''}`}
              title={isRecording ? "Stop Recording" : "Record Voice Note"}
            >
              {isRecording ? <StopSquare size={16} fill="currentColor" /> : <Mic size={16} />}
            </button>
          ) : (
            <button onClick={togglePlay} className="play-btn" title="Play/Pause">
              {playing ? <Square size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
            </button>
          )}
          <div className="waveform">
             <div className="bar" style={{height: (playing || isRecording) ? '40%' : '10%'}}></div>
             <div className="bar" style={{height: (playing || isRecording) ? '80%' : '40%'}}></div>
             <div className="bar" style={{height: playing ? '100%' : (isRecording ? '60%' : '20%')}}></div>
             <div className="bar" style={{height: playing ? '60%' : (isRecording ? '90%' : '50%')}}></div>
             <div className="bar" style={{height: (playing || isRecording) ? '80%' : '30%'}}></div>
             <div className="bar" style={{height: '50%'}}></div>
          </div>
        </div>
        {audioUrl && <audio ref={audioRef} src={audioUrl} onEnded={() => setPlaying(false)} />}
      </div>
    </Draggable>
  );
};

export default AudioCard;
