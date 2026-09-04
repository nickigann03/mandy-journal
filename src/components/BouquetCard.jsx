import React, { useRef, useMemo, useState } from 'react';
import Draggable from 'react-draggable';
import { X } from 'lucide-react';
import bouquetImg from '../assets/stickers/bouquet.jpg';

const BouquetCard = ({ id, defaultPosition, imageSrc = bouquetImg, onUpdatePosition, onDelete }) => {
  const nodeRef = useRef(null);
  const [animating, setAnimating] = useState(false);
  const rotation = useMemo(() => Math.random() * 8 - 4, []);

  const handleStop = (e, data) => {
    if (onUpdatePosition) onUpdatePosition(id, { x: data.x, y: data.y });
  };

  const triggerAnimation = () => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => setAnimating(false), 3000); // 3 seconds
  };

  // Generate 10 falling petals randomly positioned
  const petals = useMemo(() => Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 120 - 10}%`,
    delay: `${Math.random() * 1.5}s`,
    duration: `${Math.random() * 1.5 + 1.5}s`,
    color: ['#ffb6c1', '#ffd1dc', '#fff0f5'][Math.floor(Math.random() * 3)]
  })), []);

  return (
    <Draggable nodeRef={nodeRef} defaultPosition={defaultPosition} bounds="parent" cancel="button" onStop={handleStop}>
      <div 
        ref={nodeRef} 
        className="board-item drag-handle bouquet-card"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <button className="delete-btn" onClick={() => onDelete && onDelete(id)} title="Delete">
          <X size={14} />
        </button>

        <div className="bouquet-container" onClick={triggerAnimation}>
          <img src={imageSrc} alt="Virtual Bouquet" className="bouquet-img" />
          
          {animating && (
            <div className="petals-container">
              {petals.map(petal => (
                <div 
                  key={petal.id} 
                  className="falling-petal"
                  style={{
                    left: petal.left,
                    animationDelay: petal.delay,
                    animationDuration: petal.duration,
                    backgroundColor: petal.color
                  }}
                />
              ))}
            </div>
          )}
          <div className="click-me-hint">Click me!</div>
        </div>
      </div>
    </Draggable>
  );
};

export default BouquetCard;
