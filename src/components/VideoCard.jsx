import React, { useRef, useState, useMemo, useEffect } from 'react';
import Draggable from 'react-draggable';
import { Video, Square as StopSquare, X, Frame } from 'lucide-react';
import CreatorTag from './CreatorTag';

const VideoCard = ({ id, defaultPosition, title, creatorName, creatorAvatar, width = 240, height = 300, hasFrame = true, onUpdatePosition, onUpdateContent, onDelete }) => {
  const nodeRef = useRef(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(title || 'Video Note');
  const [streamReady, setStreamReady] = useState(false);
  const [frameEnabled, setFrameEnabled] = useState(hasFrame);
  
  // Resizing state
  const [size, setSize] = useState({ width, height });
  const [isResizing, setIsResizing] = useState(false);
  const startSize = useRef({ width: 0, height: 0 });
  const startPos = useRef({ x: 0, y: 0 });
  
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

  const handleResizeStart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    startSize.current = { width: size.width, height: size.height };
    startPos.current = { x: e.clientX, y: e.clientY };
    
    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startPos.current.x;
      const deltaY = moveEvent.clientY - startPos.current.y;
      setSize({
        width: Math.max(150, startSize.current.width + deltaX),
        height: Math.max(150, startSize.current.height + deltaY)
      });
    };
    
    const handleMouseUp = (e) => {
      setIsResizing(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      // Sync new size to Convex
      if (onUpdateContent) onUpdateContent(id, { 
        width: Math.max(150, startSize.current.width + (e.clientX - startPos.current.x)), 
        height: Math.max(150, startSize.current.height + (e.clientY - startPos.current.y)) 
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <Draggable nodeRef={nodeRef} defaultPosition={defaultPosition} bounds="parent" cancel="input, button, video, .resize-handle" onStop={handleStop} disabled={isResizing}>
      <div 
        ref={nodeRef} 
        className={`board-item polaroid-card drag-handle ${!frameEnabled ? 'frameless' : ''}`}
        style={{ 
          transform: `rotate(${rotation}deg)`,
          width: `${size.width}px`,
          height: `${size.height}px`
        }}
      >
        <CreatorTag name={creatorName} avatar={creatorAvatar} />
        <button className="delete-btn" onClick={() => onDelete && onDelete(id)} title="Delete Video Note">
          <X size={14} />
        </button>
        <div className="note-toolbar" style={{ right: '40px' }}>
          <button 
            onClick={() => {
              setFrameEnabled(!frameEnabled);
              if (onUpdateContent) onUpdateContent(id, { hasFrame: !frameEnabled });
            }} 
            title={frameEnabled ? "Remove Frame" : "Add Frame"}
          >
            <Frame size={14} />
          </button>
        </div>
        <div className={`washi-tape ${tapeColor}`} style={{ display: frameEnabled ? 'block' : 'none' }}></div>
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
          onBlur={() => onUpdateContent && onUpdateContent(id, { title: currentTitle, width: size.width, height: size.height, hasFrame: frameEnabled })}
          placeholder="Add a cute caption..."
          className="caption-input"
          style={{ display: frameEnabled || currentTitle ? 'block' : 'none' }}
        />
        
        <div className="resize-handle" onMouseDown={handleResizeStart}></div>
      </div>
    </Draggable>
  );
};

export default VideoCard;
