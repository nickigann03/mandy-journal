import React, { useRef, useState, useMemo, useEffect } from 'react';
import Draggable from 'react-draggable';
import { Minus, Plus, Type, X } from 'lucide-react';
import CreatorTag from './CreatorTag';

const NoteCard = ({ id, defaultPosition, text, author, shape = 'square', color = 'white', hasPushpin = false, creatorName, creatorAvatar, onUpdatePosition, onUpdateContent, onDelete }) => {
  const nodeRef = useRef(null);
  const [currentText, setCurrentText] = useState(text || '');
  const [currentAuthor, setCurrentAuthor] = useState(author || '');
  
  const [fontSize, setFontSize] = useState(1.6);
  const [fontIndex, setFontIndex] = useState(0);
  const fonts = ['var(--font-handwriting)', 'var(--font-handwriting-2)', 'var(--font-handwriting-3)'];
  
  const rotation = useMemo(() => Math.random() * 6 - 3, []);
  const tapeColor = useMemo(() => ['washi-pink', 'washi-blue', 'washi-green'][Math.floor(Math.random() * 3)], []);

  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [currentText, fontSize, fontIndex]);

  const handleStop = (e, data) => {
    if (onUpdatePosition) {
      onUpdatePosition(id, { x: data.x, y: data.y });
    }
  };

  return (
    <Draggable nodeRef={nodeRef} defaultPosition={defaultPosition} bounds="parent" cancel="textarea, input, button" onStop={handleStop}>
      <div 
        ref={nodeRef} 
        className={`board-item note-card drag-handle shape-${shape} color-${color}`} 
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <CreatorTag name={creatorName} avatar={creatorAvatar} />
        <button className="delete-btn" onClick={() => onDelete && onDelete(id)} title="Delete Note">
          <X size={14} />
        </button>
        <div className="note-toolbar">
          <button onClick={() => setFontSize(Math.max(1, fontSize - 0.2))}><Minus size={14} /></button>
          <button onClick={() => setFontSize(Math.min(4, fontSize + 0.2))}><Plus size={14} /></button>
          <button onClick={() => setFontIndex((fontIndex + 1) % fonts.length)}><Type size={14} /></button>
        </div>
        
        {hasPushpin ? (
           <div className={`pushpin ${['pin-red', 'pin-blue', 'pin-yellow'][Math.floor(Math.random()*3)]}`}></div>
        ) : (
           <div className={`washi-tape ${tapeColor}`}></div>
        )}
        
        <div className="note-content" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
          <textarea 
            ref={textareaRef}
            value={currentText} 
            onChange={(e) => setCurrentText(e.target.value)} 
            onBlur={() => onUpdateContent && onUpdateContent(id, { text: currentText, author: currentAuthor })}
            placeholder="Write a cute note..."
            className="note-textarea"
            style={{ fontSize: `${fontSize}rem`, fontFamily: fonts[fontIndex] }}
          />
          <input 
            value={currentAuthor} 
            onChange={(e) => setCurrentAuthor(e.target.value)} 
            onBlur={() => onUpdateContent && onUpdateContent(id, { text: currentText, author: currentAuthor })}
            placeholder="Sign your name"
            className="author-input"
            style={{ fontFamily: fonts[fontIndex] }}
          />
        </div>
      </div>
    </Draggable>
  );
};

export default NoteCard;
