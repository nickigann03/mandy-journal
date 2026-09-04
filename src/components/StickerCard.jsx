import React, { useRef, useMemo } from 'react';
import Draggable from 'react-draggable';
import { X } from 'lucide-react';

const StickerCard = ({ id, defaultPosition, imageSrc, onUpdatePosition, onDelete }) => {
  const nodeRef = useRef(null);
  const rotation = useMemo(() => Math.random() * 30 - 15, []); // More rotation for stickers

  const handleStop = (e, data) => {
    if (onUpdatePosition) {
      onUpdatePosition(id, { x: data.x, y: data.y });
    }
  };

  return (
    <Draggable nodeRef={nodeRef} defaultPosition={defaultPosition} bounds="parent" onStop={handleStop}>
      <div
        ref={nodeRef}
        className="board-item sticker-card drag-handle"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <button className="delete-btn" onClick={() => onDelete && onDelete(id)} title="Delete Sticker">
          <X size={14} />
        </button>
        <img src={imageSrc} alt="sticker" draggable="false" className="sticker-img" />
      </div>
    </Draggable>
  );
};

export default StickerCard;

