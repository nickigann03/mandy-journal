import React, { useRef, useState, useMemo } from 'react';
import Draggable from 'react-draggable';
import { Music, X, Check } from 'lucide-react';
import CreatorTag from './CreatorTag';

const MusicCard = ({ id, defaultPosition, url, creatorName, creatorAvatar, onUpdatePosition, onUpdateContent, onDelete }) => {
  const nodeRef = useRef(null);
  const [inputUrl, setInputUrl] = useState(url || '');
  const [isEditing, setIsEditing] = useState(!url);
  const rotation = useMemo(() => Math.random() * 4 - 2, []);

  const handleStop = (e, data) => {
    if (onUpdatePosition) onUpdatePosition(id, { x: data.x, y: data.y });
  };

  const handleSave = () => {
    setIsEditing(false);
    if (onUpdateContent) onUpdateContent(id, { url: inputUrl });
  };

  // Basic embed parser
  const getEmbedUrl = (link) => {
    if (!link) return null;
    
    // Spotify
    if (link.includes('spotify.com')) {
      // e.g. https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT
      // to https://open.spotify.com/embed/track/4cOdK2wGLETKBW3PvgPWqT
      return link.replace('open.spotify.com/', 'open.spotify.com/embed/');
    }
    
    // YouTube
    if (link.includes('youtube.com/watch') || link.includes('youtu.be/')) {
      let videoId = '';
      if (link.includes('youtu.be/')) {
        videoId = link.split('youtu.be/')[1].split('?')[0];
      } else {
        const urlParams = new URL(link);
        videoId = urlParams.searchParams.get('v');
      }
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    return null;
  };

  const embedUrl = getEmbedUrl(url);

  return (
    <Draggable nodeRef={nodeRef} defaultPosition={defaultPosition} bounds="parent" cancel="input, button, iframe" onStop={handleStop}>
      <div ref={nodeRef} className="board-item drag-handle music-card" style={{ transform: `rotate(${rotation}deg)` }}>
        <CreatorTag name={creatorName} avatar={creatorAvatar} />
        <button className="delete-btn" onClick={() => onDelete && onDelete(id)} title="Delete Music">
          <X size={14} />
        </button>

        {isEditing ? (
          <div className="music-editor">
            <Music size={32} color="#1DB954" style={{ marginBottom: '10px' }} />
            <div style={{ fontSize: '0.9rem', marginBottom: '8px', color: '#555', fontFamily: 'var(--font-ui)' }}>
              Paste Spotify or YouTube Link
            </div>
            <div style={{ display: 'flex', gap: '5px' }}>
              <input 
                value={inputUrl} 
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://open.spotify.com/..."
                className="music-input"
              />
              <button className="music-save-btn" onClick={handleSave}><Check size={16} /></button>
            </div>
          </div>
        ) : (
          <div className="music-player">
            {embedUrl ? (
              <iframe 
                src={embedUrl} 
                width="300" 
                height={url.includes('spotify') ? "152" : "200"} 
                frameBorder="0" 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy"
                title="Music Player"
                style={{ borderRadius: '12px' }}
              ></iframe>
            ) : (
              <div className="music-error" onClick={() => setIsEditing(true)}>
                <Music size={24} />
                <span>Invalid Link. Click to edit.</span>
              </div>
            )}
          </div>
        )}
      </div>
    </Draggable>
  );
};

export default MusicCard;
