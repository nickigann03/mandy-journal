import React, { useState, useRef, useEffect } from 'react';
import NoteCard from './NoteCard';
import PolaroidCard from './PolaroidCard';
import AudioCard from './AudioCard';
import VideoCard from './VideoCard';
import StickerCard from './StickerCard';
import { Plus, Type, Image as ImageIcon, Mic, Video as VideoIcon, Sparkles } from 'lucide-react';

import flowerImg from '../assets/stickers/flower.jpg';
import starImg from '../assets/stickers/star.jpg';
import heartImg from '../assets/stickers/heart.jpg';

const stickers = [flowerImg, starImg, heartImg];
const noteColors = ['white', 'yellow', 'pink', 'blue', 'green'];
const noteShapes = ['square', 'circle', 'scallop'];

const PinboardCanvas = () => {
  const [items, setItems] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setItems([
      { 
        id: 1, 
        type: 'note', 
        text: 'Welcome to your premium digital pinboard!\n\nClick the + button to add voice notes, videos, photos, and text.\n\nYou can drag everything around and edit this text directly!', 
        author: 'Antigravity', 
        position: { x: 1500 - 130, y: 150 },
        shape: 'scallop',
        color: 'pink',
        hasPushpin: true
      },
      {
        id: 2,
        type: 'sticker',
        imageSrc: starImg,
        position: { x: 1500 - 250, y: 100 }
      },
      {
        id: 3,
        type: 'sticker',
        imageSrc: flowerImg,
        position: { x: 1500 + 150, y: 300 }
      }
    ]);
    
    if (wrapperRef.current) {
      wrapperRef.current.scrollTop = 0;
      wrapperRef.current.scrollLeft = 1500 - window.innerWidth / 2;
    }
  }, []);

  const findEmptyPosition = () => {
    let x = 1500 - 130;
    let y = 150;
    let radius = 50;
    let angle = 0;
    
    const isOverlapping = (px, py) => {
      return items.some(item => {
        const dx = Math.abs(item.position.x - px);
        const dy = Math.abs(item.position.y - py);
        return dx < 280 && dy < 240;
      });
    };

    while (isOverlapping(x, y) && radius < 1500) {
      x = 1500 - 130 + Math.cos(angle) * radius;
      y = 150 + Math.sin(angle) * radius;
      angle += 0.5;
      radius += 5;
    }
    
    return { x, y };
  };

  const addItem = (type) => {
    const position = findEmptyPosition();
    const newItem = { id: Date.now(), type, position };

    if (type === 'note') {
      newItem.text = '';
      newItem.author = '';
      newItem.shape = noteShapes[Math.floor(Math.random() * noteShapes.length)];
      newItem.color = noteColors[Math.floor(Math.random() * noteColors.length)];
      newItem.hasPushpin = Math.random() > 0.5; // 50% chance for pushpin instead of tape
    } else if (type === 'polaroid') {
      newItem.imageSrc = '';
      newItem.caption = '';
    } else if (type === 'audio') {
      newItem.title = 'Voice Note';
    } else if (type === 'video') {
      newItem.title = 'Video Note';
    } else if (type === 'sticker') {
      newItem.imageSrc = stickers[Math.floor(Math.random() * stickers.length)];
      // Stickers are smaller, let's adjust position slightly so they don't jump too far
      newItem.position.x += 100;
      newItem.position.y += 100;
    }

    setItems([...items, newItem]);
    setMenuOpen(false);
  };

  return (
    <div className="pinboard-wrapper" ref={wrapperRef}>
      <div className="pinboard-canvas">
        <div className="board-title" style={{ position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)' }}>
          We will miss you Mandy!
        </div>
        {items.map(item => {
          if (item.type === 'note') {
             return <NoteCard key={item.id} defaultPosition={item.position} text={item.text} author={item.author} shape={item.shape} color={item.color} hasPushpin={item.hasPushpin} />;
          }
          if (item.type === 'polaroid') {
            return <PolaroidCard key={item.id} defaultPosition={item.position} imageSrc={item.imageSrc} caption={item.caption} />;
          }
          if (item.type === 'audio') {
            return <AudioCard key={item.id} defaultPosition={item.position} title={item.title} />;
          }
          if (item.type === 'video') {
            return <VideoCard key={item.id} defaultPosition={item.position} title={item.title} />;
          }
          if (item.type === 'sticker') {
            return <StickerCard key={item.id} defaultPosition={item.position} imageSrc={item.imageSrc} />;
          }
          return null;
        })}
      </div>

      {/* Floating Action Button */}
      <div className="fab-container">
        {menuOpen && (
          <div className="fab-menu">
            <button onClick={() => addItem('note')} title="Add Note"><Type size={20} /></button>
            <button onClick={() => addItem('polaroid')} title="Add Photo"><ImageIcon size={20} /></button>
            <button onClick={() => addItem('audio')} title="Add Voice Note"><Mic size={20} /></button>
            <button onClick={() => addItem('video')} title="Add Video Clip"><VideoIcon size={20} /></button>
            <button onClick={() => addItem('sticker')} title="Add Cute Sticker"><Sparkles size={20} /></button>
          </div>
        )}
        <button className="fab-main" onClick={() => setMenuOpen(!menuOpen)}>
          <Plus size={28} className={menuOpen ? 'rotate' : ''} />
        </button>
      </div>
    </div>
  );
};

export default PinboardCanvas;
