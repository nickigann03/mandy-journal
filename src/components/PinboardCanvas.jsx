import React, { useState, useRef, useEffect } from 'react';
import NoteCard from './NoteCard';
import PolaroidCard from './PolaroidCard';
import AudioCard from './AudioCard';
import VideoCard from './VideoCard';
import StickerCard from './StickerCard';
import { Plus, Type, Image as ImageIcon, Mic, Video as VideoIcon, Sparkles, X } from 'lucide-react';

import catImg from '../assets/stickers/cat.png';
import sunImg from '../assets/stickers/sun.png';
import rainbowImg from '../assets/stickers/rainbow.png';
import coffeeImg from '../assets/stickers/coffee.png';
import dogImg from '../assets/stickers/dog.png';
import cactusImg from '../assets/stickers/cactus.png';
import pizzaImg from '../assets/stickers/pizza.png';
import flowerImg from '../assets/stickers/flower.png';
import starImg from '../assets/stickers/star.png';
import heartImg from '../assets/stickers/heart.png';

const stickers = [catImg, sunImg, rainbowImg, coffeeImg, dogImg, cactusImg, pizzaImg, flowerImg, starImg, heartImg];
const noteColors = ['white', 'yellow', 'pink', 'blue', 'green'];
const noteShapes = ['square', 'circle', 'scallop'];

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

const PinboardCanvas = () => {
  const items = useQuery(api.items.get) || [];
  const addItemMutation = useMutation(api.items.add);
  const updatePosition = useMutation(api.items.updatePosition);
  const updateContentMutation = useMutation(api.items.updateContent);
  const removeItemMutation = useMutation(api.items.remove);
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [showNotePicker, setShowNotePicker] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
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

  const addItem = (type, options = null) => {
    const position = findEmptyPosition();
    const newItem = { type, position };

    if (type === 'note') {
      newItem.text = '';
      newItem.author = '';
      newItem.shape = options?.shape || 'square';
      newItem.color = options?.color || 'white';
      newItem.hasPushpin = Math.random() > 0.5;
    } else if (type === 'polaroid') {
      newItem.imageSrc = '';
      newItem.caption = '';
    } else if (type === 'audio') {
      newItem.title = 'Voice Note';
    } else if (type === 'video') {
      newItem.title = 'Video Note';
    } else if (type === 'sticker') {
      newItem.imageSrc = options; // For stickers, options is just the image source
      newItem.position.x += 100;
      newItem.position.y += 100;
    }

    addItemMutation(newItem);
    if (type !== 'sticker' && type !== 'note') setMenuOpen(false); 
    setShowStickerPicker(false);
    setShowNotePicker(false);
  };

  const handleUpdatePosition = (id, position) => {
    updatePosition({ id, position });
  };

  const handleUpdateContent = (id, updates) => {
    updateContentMutation({ id, ...updates });
  };

  const handleDelete = (id) => {
    removeItemMutation({ id });
  };

  return (
    <div className="pinboard-wrapper" ref={wrapperRef}>
      <div className="pinboard-canvas">
        <div className="board-title" style={{ position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', fontSize: '2.5rem', opacity: 0.8 }}>
          Dearest Mandy,
        </div>
        {items.map(item => {
          if (item.type === 'note') {
             return <NoteCard key={item._id} id={item._id} defaultPosition={item.position} onUpdatePosition={handleUpdatePosition} onUpdateContent={handleUpdateContent} onDelete={handleDelete} text={item.text} author={item.author} shape={item.shape} color={item.color} hasPushpin={item.hasPushpin} />;
          }
          if (item.type === 'polaroid') {
            return <PolaroidCard key={item._id} id={item._id} defaultPosition={item.position} onUpdatePosition={handleUpdatePosition} onUpdateContent={handleUpdateContent} onDelete={handleDelete} imageSrc={item.imageSrc} caption={item.caption} />;
          }
          if (item.type === 'audio') {
            return <AudioCard key={item._id} id={item._id} defaultPosition={item.position} onUpdatePosition={handleUpdatePosition} onUpdateContent={handleUpdateContent} onDelete={handleDelete} title={item.title} />;
          }
          if (item.type === 'video') {
            return <VideoCard key={item._id} id={item._id} defaultPosition={item.position} onUpdatePosition={handleUpdatePosition} onUpdateContent={handleUpdateContent} onDelete={handleDelete} title={item.title} />;
          }
          if (item.type === 'sticker') {
            return <StickerCard key={item._id} id={item._id} defaultPosition={item.position} onUpdatePosition={handleUpdatePosition} onDelete={handleDelete} imageSrc={item.imageSrc} />;
          }
          return null;
        })}
      </div>

      {/* Floating Action Button */}
      <div className="fab-container">
        {showStickerPicker && (
          <div className="sticker-picker">
            {stickers.map((src, i) => (
              <button key={i} className="sticker-option" onClick={() => addItem('sticker', src)}>
                <img src={src} alt={`sticker ${i}`} />
              </button>
            ))}
          </div>
        )}

        {showNotePicker && (
          <div className="sticker-picker" style={{ gridTemplateColumns: 'repeat(5, 1fr)', width: '220px' }}>
            {noteColors.map((color, i) => (
              <button key={`square-${i}`} className={`note-option shape-square color-${color}`} onClick={() => addItem('note', { shape: 'square', color })}></button>
            ))}
            {noteColors.map((color, i) => (
              <button key={`circle-${i}`} className={`note-option shape-circle color-${color}`} onClick={() => addItem('note', { shape: 'circle', color })}></button>
            ))}
            {noteColors.map((color, i) => (
              <button key={`scallop-${i}`} className={`note-option shape-scallop color-${color}`} onClick={() => addItem('note', { shape: 'scallop', color })}></button>
            ))}
          </div>
        )}
        
        {menuOpen && !showStickerPicker && !showNotePicker && (
          <div className="fab-menu">
            <button onClick={() => setShowNotePicker(true)} title="Add Note"><Type size={20} /></button>
            <button onClick={() => addItem('polaroid')} title="Add Photo"><ImageIcon size={20} /></button>
            <button onClick={() => addItem('audio')} title="Add Voice Note"><Mic size={20} /></button>
            <button onClick={() => addItem('video')} title="Add Video Clip"><VideoIcon size={20} /></button>
            <button onClick={() => setShowStickerPicker(true)} title="Add Cute Sticker"><Sparkles size={20} /></button>
          </div>
        )}
        <button className="fab-main" onClick={() => {
          if (showStickerPicker || showNotePicker) {
            setShowStickerPicker(false);
            setShowNotePicker(false);
          } else {
            setMenuOpen(!menuOpen);
          }
        }}>
          <Plus size={28} className={menuOpen || showStickerPicker || showNotePicker ? 'rotate' : ''} />
        </button>
      </div>
    </div>
  );
};

export default PinboardCanvas;
