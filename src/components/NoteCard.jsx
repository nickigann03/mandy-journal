import React, { useRef, useState, useMemo } from 'react';
import Draggable from 'react-draggable';
import { Minus, Plus, Type } from 'lucide-react';

const NoteCard = ({ defaultPosition, text, author, shape = 'square', color = 'white', hasPushpin = false }) => {
  const nodeRef = useRef(null);
  const [currentText, setCurrentText] = useState(text);
  const [currentAuthor, setCurrentAuthor] = useState(author);
  
  const [fontSize, setFontSize] = useState(1.6);
  const [fontIndex, setFontIndex] = useState(0);
  const fonts = ['var(--font-handwriting)', 'var(--font-handwriting-2)', 'var(--font-handwriting-3)'];
  
  const rotation = useMemo(() => Math.random() * 6 - 3, []);
  const tapeColor = useMemo(() => ['washi-pink', 'washi-blue', 'washi-green'][Math.floor(Math.random() * 3)], []);

  return (
    <Draggable nodeRef={nodeRef} defaultPosition={defaultPosition} bounds="parent" cancel="textarea, input, button">
      <div 
        ref={nodeRef} 
        className={`board-item note-card drag-handle shape-${shape} color-${color}`} 
        style={{ transform: `rotate(${rotation}deg)` }}
      >
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
            value={currentText} 
            onChange={(e) => setCurrentText(e.target.value)} 
            placeholder="Write a cute note..."
            className="note-textarea"
            style={{ fontSize: `${fontSize}rem`, fontFamily: fonts[fontIndex] }}
          />
          <input 
            value={currentAuthor} 
            onChange={(e) => setCurrentAuthor(e.target.value)} 
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
