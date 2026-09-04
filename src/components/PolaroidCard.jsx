import React, { useRef, useState, useMemo } from 'react';
import Draggable from 'react-draggable';
import { Upload } from 'lucide-react';

const PolaroidCard = ({ defaultPosition, imageSrc, caption }) => {
  const nodeRef = useRef(null);
  const [currentImage, setCurrentImage] = useState(imageSrc);
  const [currentCaption, setCurrentCaption] = useState(caption);
  const fileInputRef = useRef(null);
  
  const rotation = useMemo(() => Math.random() * 6 - 3, []);
  const tapeColor = useMemo(() => ['washi-pink', 'washi-blue', 'washi-green'][Math.floor(Math.random() * 3)], []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCurrentImage(url);
    }
  };

  return (
    <Draggable nodeRef={nodeRef} defaultPosition={defaultPosition} bounds="parent" cancel="input, button, .photo-container">
      <div 
        ref={nodeRef} 
        className="board-item polaroid-card drag-handle"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
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
          placeholder="Add a cute caption..."
          className="caption-input"
        />
      </div>
    </Draggable>
  );
};

export default PolaroidCard;
