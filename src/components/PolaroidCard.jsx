import React, { useRef, useState, useMemo } from 'react';
import Draggable from 'react-draggable';
import { Upload, X, Maximize, Frame } from 'lucide-react';
import CreatorTag from './CreatorTag';

const PolaroidCard = ({ id, defaultPosition, imageSrc, caption, creatorName, creatorAvatar, width = 240, height = 300, hasFrame = true, onUpdatePosition, onUpdateContent, onDelete }) => {
  const nodeRef = useRef(null);
  const [currentImage, setCurrentImage] = useState(imageSrc || '');
  const [currentCaption, setCurrentCaption] = useState(caption || '');
  const [frameEnabled, setFrameEnabled] = useState(hasFrame);
  
  // Resizing state
  const [size, setSize] = useState({ width, height });
  const [isResizing, setIsResizing] = useState(false);
  const startSize = useRef({ width: 0, height: 0 });
  const startPos = useRef({ x: 0, y: 0 });
  const fileInputRef = useRef(null);
  
  const rotation = useMemo(() => Math.random() * 6 - 3, []);
  const tapeColor = useMemo(() => ['washi-pink', 'washi-blue', 'washi-green'][Math.floor(Math.random() * 3)], []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file); // For local preview/demo. Real app would upload to Convex Storage.
      setCurrentImage(url);
      if (onUpdateContent) onUpdateContent(id, { imageSrc: url, caption: currentCaption });
    }
  };

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
    
    const handleMouseUp = () => {
      setIsResizing(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      // Sync new size to Convex
      if (onUpdateContent) onUpdateContent(id, { 
        width: Math.max(150, startSize.current.width + (window.event.clientX - startPos.current.x)), 
        height: Math.max(150, startSize.current.height + (window.event.clientY - startPos.current.y)) 
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <Draggable nodeRef={nodeRef} defaultPosition={defaultPosition} bounds="parent" cancel="input, button, .photo-container, .resize-handle" onStop={handleStop} disabled={isResizing}>
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
        {onDelete && (
          <button className="delete-btn" onClick={() => onDelete(id)} title="Delete Photo">
            <X size={14} />
          </button>
        )}
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
        <div className="photo-container" onClick={() => !currentImage && fileInputRef.current.click()}>
          {currentImage ? (
            <>
              <img src={currentImage} alt="polaroid" draggable="false" />
              <button className="change-img-btn" onClick={() => fileInputRef.current.click()} title="Change Image">
                <Upload size={16} />
              </button>
            </>
          ) : (
            <div className="upload-placeholder">
              <Upload size={32} />
              <span>Click to upload</span>
            </div>
          )}
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} />
        </div>
        <input 
          value={currentCaption} 
          onChange={(e) => setCurrentCaption(e.target.value)}
          onBlur={() => onUpdateContent && onUpdateContent(id, { imageSrc: currentImage, caption: currentCaption, width: size.width, height: size.height, hasFrame: frameEnabled })}
          placeholder="Add a cute caption..."
          className="caption-input"
          style={{ display: frameEnabled || currentCaption ? 'block' : 'none' }}
        />
        
        <div className="resize-handle" onMouseDown={handleResizeStart}></div>
      </div>
    </Draggable>
  );
};

export default PolaroidCard;
