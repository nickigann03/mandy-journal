import React, { useRef, useState, useMemo } from 'react';
import Draggable from 'react-draggable';
import { Upload, X } from 'lucide-react';

const PolaroidCard = ({ id, defaultPosition, imageSrc, caption, onUpdatePosition, onUpdateContent, onDelete }) => {
  const nodeRef = useRef(null);
  const [currentImage, setCurrentImage] = useState(imageSrc || '');
  const [currentCaption, setCurrentCaption] = useState(caption || '');
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

  return (
    <Draggable nodeRef={nodeRef} defaultPosition={defaultPosition} bounds="parent" cancel="input, button, .photo-container" onStop={handleStop}>
      <div 
        ref={nodeRef} 
        className="board-item polaroid-card drag-handle"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <button className="delete-btn" onClick={() => onDelete && onDelete(id)} title="Delete Photo">
          <X size={14} />
        </button>
        <div className={`washi-tape ${tapeColor}`}></div>
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
          onBlur={() => onUpdateContent && onUpdateContent(id, { imageSrc: currentImage, caption: currentCaption })}
          placeholder="Add a cute caption..."
          className="caption-input"
        />
      </div>
    </Draggable>
  );
};

export default PolaroidCard;
