import React, { useRef, useMemo } from 'react';
import Draggable from 'react-draggable';
import { X } from 'lucide-react';

const StickerCard = ({ id, defaultPosition, imageSrc, creatorName, creatorAvatar, onUpdatePosition, onDelete }) => {
  const nodeRef = useRef(null);
  const rotation = useMemo(() => Math.random() * 20 - 10, []);

  const handleStop = (e, data) => {
    if (onUpdatePosition) onUpdatePosition(id, { x: data.x, y: data.y });
  };

  return (
    <Draggable nodeRef={nodeRef} defaultPosition={defaultPosition} bounds="parent" cancel="button" onStop={handleStop}>
      <div ref={nodeRef} className="board-item drag-handle" style={{ background: 'none', boxShadow: 'none', padding: 0, transform: `rotate(${rotation}deg)` }}>
        <div style={{ position: 'relative' }}>
          <button className="delete-btn" onClick={() => onDelete && onDelete(id)} style={{ top: 0, right: 0 }} title="Remove Sticker">
            <X size={14} />
          </button>
        </div>
        <img src={imageSrc} alt="sticker" draggable="false" className="sticker-img" />
      </div>
    </Draggable>
  );
};

export default StickerCard;

