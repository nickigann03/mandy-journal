import React, { useRef, useState, useMemo, useEffect } from 'react';
import Draggable from 'react-draggable';
import { Video, Square as StopSquare, X } from 'lucide-react';

const VideoCard = ({ id, defaultPosition, title, onUpdatePosition, onUpdateContent, onDelete }) => {
  const nodeRef = useRef(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(title || 'Video Note');
  const [streamReady, setStreamReady] = useState(false);
  
  const videoPreviewRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const rotation = useMemo(() => Math.random() * 6 - 3, []);
  const tapeColor = useMemo(() => ['washi-pink', 'washi-blue', 'washi-green'][Math.floor(Math.random() * 3)], []);

  const initCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
        videoPreviewRef.current.muted = true;
      }
      setStreamReady(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Please allow camera and microphone access to record a video note.");
    }
  };

  const startRecording = () => {
    if (!videoPreviewRef.current || !videoPreviewRef.current.srcObject) return;
    const stream = videoPreviewRef.current.srcObject;
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
      stream.getTracks().forEach(track => track.stop());
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  useEffect(() => {
    if (!videoUrl && !streamReady) {
      initCamera();
    }
  }, [videoUrl, streamReady]);

  const handleStop = (e, data) => {
    if (onUpdatePosition) {
      onUpdatePosition(id, { x: data.x, y: data.y });
    }
  };

  return (
    <Draggable nodeRef={nodeRef} defaultPosition={defaultPosition} bounds="parent" cancel="input, button, video" onStop={handleStop}>
      <div 
        ref={nodeRef} 
        className="board-item polaroid-card drag-handle"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <button className="delete-btn" onClick={() => onDelete && onDelete(id)} title="Delete Video Note">
          <X size={14} />
        </button>
        <div className={`washi-tape ${tapeColor}`}></div>
        <div className="photo-container">
          {!videoUrl ? (
            <>
              <video 
                ref={videoPreviewRef} 
                autoPlay 
                playsInline 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
              <button 
                className={`record-btn change-img-btn ${isRecording ? 'recording' : ''}`} 
                onClick={isRecording ? stopRecording : startRecording}
                style={{ opacity: 1, backgroundColor: isRecording ? '#ff4757' : 'var(--accent-color)' }}
                title={isRecording ? "Stop Recording" : "Start Recording"}
              >
                {isRecording ? <StopSquare size={16} /> : <Video size={16} />}
              </button>
            </>
          ) : (
            <video 
              src={videoUrl} 
              controls 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          )}
        </div>
        <input 
          value={currentTitle} 
          onChange={(e) => setCurrentTitle(e.target.value)} 
          onBlur={() => onUpdateContent && onUpdateContent(id, { title: currentTitle })}
          placeholder="Add a cute caption..."
          className="caption-input"
        />
      </div>
    </Draggable>
  );
};

export default VideoCard;
