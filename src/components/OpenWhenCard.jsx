import React, { useRef, useState, useMemo, useEffect } from 'react';
import Draggable from 'react-draggable';
import { Mail, MailOpen, X, Edit3 } from 'lucide-react';

const OpenWhenCard = ({ id, defaultPosition, prompt, text, isOpen = false, color = 'white', onUpdatePosition, onUpdateContent, onDelete }) => {
  const nodeRef = useRef(null);
  const [currentPrompt, setCurrentPrompt] = useState(prompt || '');
  const [currentText, setCurrentText] = useState(text || '');
  const [opened, setOpened] = useState(isOpen);
  
  const rotation = useMemo(() => Math.random() * 6 - 3, []);
  
  const textareaRef = useRef(null);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.max(140, textareaRef.current.scrollHeight) + 'px';
    }
  }, [currentText, opened]);

  const handleStop = (e, data) => {
    if (onUpdatePosition) onUpdatePosition(id, { x: data.x, y: data.y });
  };

  const toggleOpen = () => {
    setOpened(!opened);
    if (onUpdateContent) onUpdateContent(id, { isOpen: !opened });
  };

  return (
    <Draggable nodeRef={nodeRef} defaultPosition={defaultPosition} bounds="parent" cancel="textarea, input, button, .interactive" onStop={handleStop}>
      <div 
        ref={nodeRef} 
        className={`board-item drag-handle open-when-card ${opened ? 'is-open' : 'is-closed'} color-${color}`}
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <button className="delete-btn" onClick={() => onDelete && onDelete(id)} title="Delete">
          <X size={14} />
        </button>

        {!opened ? (
          <div className="envelope-closed interactive" onClick={toggleOpen}>
            <div className="envelope-prompt">
              Open when...
              <input 
                value={currentPrompt} 
                onChange={(e) => setCurrentPrompt(e.target.value)}
                onBlur={() => onUpdateContent && onUpdateContent(id, { prompt: currentPrompt })}
                placeholder="you're sad"
                className="prompt-input"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="click-to-open">Click to open</div>
          </div>
        ) : (
          <div className="envelope-opened interactive">
            <div className="envelope-header">
              <button onClick={toggleOpen} className="close-envelope-btn" title="Fold back"><MailOpen size={18} /></button>
              <div className="opened-prompt">Open when {currentPrompt || "..."}</div>
            </div>
            <div className="letter-paper">
              <textarea 
                ref={textareaRef}
                value={currentText} 
                onChange={(e) => setCurrentText(e.target.value)}
                onBlur={() => onUpdateContent && onUpdateContent(id, { text: currentText })}
                placeholder="Write your letter here..."
                className="letter-textarea"
              />
            </div>
          </div>
        )}
      </div>
    </Draggable>
  );
};

export default OpenWhenCard;
