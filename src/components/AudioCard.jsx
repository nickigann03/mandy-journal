import React, { useRef, useState, useMemo } from 'react';
import Draggable from 'react-draggable';
import { Play, Square, Disc, Mic, Square as StopSquare, X, Palette } from 'lucide-react';
import CreatorTag from './CreatorTag';

const AudioCard = ({ id, defaultPosition, title, creatorName, creatorAvatar, color = 'white', onUpdatePosition, onUpdateContent, onDelete }) => {
  const nodeRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(title || 'Voice Note');
  const [currentColor, setCurrentColor] = useState(color);
  const [showPalette, setShowPalette] = useState(false);
  
  const colors = ['white', 'yellow', 'pink', 'blue', 'green'];
  
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

  const handleStop = (e, data) => {
    if (onUpdatePosition) {
      onUpdatePosition(id, { x: data.x, y: data.y });
    }
  };

  return (
    <Draggable nodeRef={nodeRef} defaultPosition={defaultPosition} bounds="parent" cancel="input, button" onStop={handleStop}>
      <div 
        ref={nodeRef} 
        className={`board-item media-card drag-handle color-${currentColor}`}
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <CreatorTag name={creatorName} avatar={creatorAvatar} />
        <button className="delete-btn" onClick={() => onDelete && onDelete(id)} title="Delete Audio Note">
          <X size={14} />
        </button>
        <div className="note-toolbar" style={{ right: '40px' }}>
          <button onClick={() => setShowPalette(!showPalette)}><Palette size={14} /></button>
        </div>
        
        {showPalette && (
          <div className="color-picker-drawer">
            {colors.map(c => (
              <button 
                key={c} 
                className={`note-option shape-square color-${c}`} 
                style={{ width: 24, height: 24, padding: 0 }}
                onClick={() => {
                  setCurrentColor(c);
                  setShowPalette(false);
                  if (onUpdateContent) onUpdateContent(id, { color: c });
                }}
              />
            ))}
          </div>
        )}
        
        <div className={`washi-tape ${tapeColor}`}></div>
        <div className="audio-header">
          <Disc className={`disc-icon ${playing ? 'spinning' : ''}`} size={32} />
          <input 
            value={currentTitle} 
            onChange={(e) => setCurrentTitle(e.target.value)} 
            onBlur={() => onUpdateContent && onUpdateContent(id, { title: currentTitle })}
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
