import React, { useRef, useMemo } from 'react';
import Draggable from 'react-draggable';

const StickerCard = ({ defaultPosition, emoji }) => {
  const nodeRef = useRef(null);
  const rotation = useMemo(() => Math.random() * 30 - 15, []); // More rotation for stickers

  return (
    <Draggable nodeRef={nodeRef} defaultPosition={defaultPosition} bounds="parent">
      <div 
        ref={nodeRef} 
        className="board-item sticker-card drag-handle"
        style={{ transform: `rotate(${rotation}deg)`, fontSize: '4rem', userSelect: 'none' }}
      >
        <span draggable="false">{emoji}</span>
      </div>
    </Draggable>
  );
};

export default StickerCard;
