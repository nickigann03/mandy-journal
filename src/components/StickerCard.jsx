import React, { useRef, useMemo } from 'react';
import Draggable from 'react-draggable';

const StickerCard = ({ defaultPosition, imageSrc }) => {
  const nodeRef = useRef(null);
  const rotation = useMemo(() => Math.random() * 30 - 15, []); // More rotation for stickers

  return (
    <Draggable nodeRef={nodeRef} defaultPosition={defaultPosition} bounds="parent">
      <div 
        ref={nodeRef} 
        className="board-item sticker-card drag-handle"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <img src={imageSrc} alt="sticker" draggable="false" />
      </div>
    </Draggable>
  );
};

export default StickerCard;
