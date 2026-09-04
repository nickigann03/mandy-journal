import React, { useState, useRef, useEffect } from 'react';
import NoteCard from './NoteCard';
import PolaroidCard from './PolaroidCard';
import AudioCard from './AudioCard';
import VideoCard from './VideoCard';
import StickerCard from './StickerCard';
import OpenWhenCard from './OpenWhenCard';
import MusicCard from './MusicCard';
import BouquetCard from './BouquetCard';
import { Plus, Type, Image as ImageIcon, Mic, Video as VideoIcon, Sparkles, X, Mail, Music, Gift } from 'lucide-react';

import bouquetImg from '../assets/stickers/bouquet.png';
import bouquetPinkImg from '../assets/stickers/bouquet_pink.png';
import catImg from '../assets/stickers/cat.png';
import sunImg from '../assets/stickers/sun.png';
import rainbowImg from '../assets/stickers/rainbow.png';
import dogImg from '../assets/stickers/dog.png';
import cactusImg from '../assets/stickers/cactus.png';
import pizzaImg from '../assets/stickers/pizza.png';
import flowerImg from '../assets/stickers/flower.png';
import starImg from '../assets/stickers/star.png';
import heartImg from '../assets/stickers/heart.png';

const stickers = [catImg, sunImg, rainbowImg, dogImg, cactusImg, pizzaImg, flowerImg, starImg, heartImg];
const bouquetOptions = [bouquetImg, bouquetPinkImg];
const noteColors = ['white', 'yellow', 'pink', 'blue', 'green'];
const noteShapes = ['square', 'circle', 'scallop'];

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

const PinboardCanvas = ({ currentUser }) => {
  const items = useQuery(api.items.get) || [];
  const addItemMutation = useMutation(api.items.add);
  const updatePosition = useMutation(api.items.updatePosition);
  const updateContentMutation = useMutation(api.items.updateContent);
  const removeItemMutation = useMutation(api.items.remove);
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [showNotePicker, setShowNotePicker] = useState(false);
  const [showEnvelopePicker, setShowEnvelopePicker] = useState(false);
  const [showBouquetPicker, setShowBouquetPicker] = useState(false);
  const [mediaPickerType, setMediaPickerType] = useState(null); // 'polaroid' or 'video'
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.scrollTop = 0;
      wrapperRef.current.scrollLeft = 1500 - window.innerWidth / 2;
    }
  }, []);

  const findEmptyPosition = () => {
    // Start at center of current viewport
    const scrollX = wrapperRef.current ? wrapperRef.current.scrollLeft : 0;
    const scrollY = wrapperRef.current ? wrapperRef.current.scrollTop : 0;
    const startX = scrollX + (window.innerWidth / 2) - 130;
    const startY = scrollY + (window.innerHeight / 2) - 150;
    
    let x = startX;
    let y = startY;
    let radius = 50;
    let angle = 0;
    
    const isOverlapping = (px, py) => {
      // Use a smaller overlap threshold for mobile devices
      const isMobile = window.innerWidth < 768;
      const xThreshold = isMobile ? 120 : 250;
      const yThreshold = isMobile ? 150 : 220;
      return items.some(item => {
        const dx = Math.abs(item.position.x - px);
        const dy = Math.abs(item.position.y - py);
        return dx < xThreshold && dy < yThreshold;
      });
    };

    while (isOverlapping(x, y) && radius < 1500) {
      x = startX + Math.cos(angle) * radius;
      y = startY + Math.sin(angle) * radius;
      angle += 0.5;
      radius += 5;
    }
    
    // Ensure it doesn't spawn completely off-screen or out of bounds
    const maxBoardWidth = window.innerWidth;
    x = Math.max(0, Math.min(x, Math.max(maxBoardWidth - 250, 0)));
    y = Math.max(0, Math.min(y, 3000 - 250));
    
    return { x, y };
  };

  const addItem = (type, options = null) => {
    const position = findEmptyPosition();
    const newItem = { type, position };
    
    if (currentUser) {
      newItem.creatorName = currentUser.name;
      newItem.creatorAvatar = currentUser.avatar;
    }

    // Auto-scroll to the new item's location
    setTimeout(() => {
      if (wrapperRef.current) {
        wrapperRef.current.scrollTo({
          top: newItem.position.y - window.innerHeight / 2 + 150,
          behavior: 'smooth'
        });
      }
    }, 250);

    if (type === 'note') {
      newItem.text = '';
      newItem.author = '';
      newItem.shape = options?.shape || 'square';
      newItem.color = options?.color || 'white';
      newItem.hasPushpin = Math.random() > 0.5;
    } else if (type === 'polaroid') {
      newItem.imageSrc = '';
      newItem.caption = '';
      newItem.hasFrame = options?.hasFrame ?? true;
    } else if (type === 'audio') {
      newItem.title = 'Voice Note';
    } else if (type === 'video') {
      newItem.title = 'Video Note';
      newItem.hasFrame = options?.hasFrame ?? true;
    } else if (type === 'sticker') {
      newItem.imageSrc = options; // For stickers, options is just the image source
      newItem.position.x += 100;
      newItem.position.y += 100;
    } else if (type === 'open_when') {
      newItem.color = options?.color || 'white';
    } else if (type === 'bouquet') {
      newItem.imageSrc = options;
    }

    addItemMutation(newItem);
    if (type !== 'sticker' && type !== 'note' && type !== 'polaroid' && type !== 'video' && type !== 'open_when' && type !== 'bouquet') setMenuOpen(false); 
    setShowStickerPicker(false);
    setShowNotePicker(false);
    setShowEnvelopePicker(false);
    setShowBouquetPicker(false);
    setMediaPickerType(null);
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
          const commonProps = {
            id: item._id, defaultPosition: item.position,
            onUpdatePosition: handleUpdatePosition, onDelete: handleDelete,
            creatorName: item.creatorName, creatorAvatar: item.creatorAvatar
          };

          if (item.type === 'note') {
             return <NoteCard key={item._id} {...commonProps} onUpdateContent={handleUpdateContent} text={item.text} author={item.author} shape={item.shape} color={item.color} hasPushpin={item.hasPushpin} />;
          }
          if (item.type === 'polaroid') {
            return <PolaroidCard key={item._id} {...commonProps} onUpdateContent={handleUpdateContent} imageSrc={item.imageSrc} caption={item.caption} hasFrame={item.hasFrame} width={item.width} height={item.height} />;
          }
          if (item.type === 'audio') {
            return <AudioCard key={item._id} {...commonProps} onUpdateContent={handleUpdateContent} title={item.title} />;
          }
          if (item.type === 'video') {
            return <VideoCard key={item._id} {...commonProps} onUpdateContent={handleUpdateContent} title={item.title} hasFrame={item.hasFrame} width={item.width} height={item.height} />;
          }
          if (item.type === 'sticker') {
            return <StickerCard key={item._id} {...commonProps} imageSrc={item.imageSrc} />;
          }
          if (item.type === 'open_when') {
            return <OpenWhenCard key={item._id} {...commonProps} onUpdateContent={handleUpdateContent} prompt={item.prompt} text={item.text} isOpen={item.isOpen} color={item.color} />;
          }
          if (item.type === 'music') {
            return <MusicCard key={item._id} {...commonProps} onUpdateContent={handleUpdateContent} url={item.url} />;
          }
          if (item.type === 'bouquet') {
            return <BouquetCard key={item._id} {...commonProps} imageSrc={item.imageSrc} />;
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

        {showEnvelopePicker && (
          <div className="sticker-picker" style={{ gridTemplateColumns: 'repeat(5, 1fr)', width: '220px' }}>
            {noteColors.map((color, i) => (
              <button key={`envelope-${i}`} className={`note-option shape-square color-${color}`} style={{ borderRadius: '4px' }} onClick={() => addItem('open_when', { color })}></button>
            ))}
          </div>
        )}

        {showBouquetPicker && (
          <div className="sticker-picker" style={{ gridTemplateColumns: 'repeat(2, 1fr)', width: '120px' }}>
            {bouquetOptions.map((src, i) => (
              <button key={`bouquet-${i}`} className="sticker-option" style={{ padding: '4px' }} onClick={() => addItem('bouquet', src)}>
                <img src={src} alt={`bouquet ${i}`} style={{ mixBlendMode: 'multiply' }} />
              </button>
            ))}
          </div>
        )}
        
        {mediaPickerType && (
          <div className="sticker-picker" style={{ gridTemplateColumns: '1fr 1fr', width: 'max-content', gap: '12px' }}>
            <button onClick={() => addItem(mediaPickerType, { hasFrame: true })} title="With Classic Frame" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 15px', border: '2px solid var(--text-primary)', borderRadius: '12px', background: 'white', cursor: 'pointer' }}>
              {mediaPickerType === 'polaroid' ? <ImageIcon size={28} color="#555" /> : <VideoIcon size={28} color="#555" />}
              <div style={{ fontSize: '0.85rem', marginTop: '6px', color: '#555', fontFamily: 'var(--font-ui)', fontWeight: 700 }}>Framed</div>
            </button>
            <button onClick={() => addItem(mediaPickerType, { hasFrame: false })} title="Frameless, Edge-to-Edge" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 15px', border: '2px dashed #aaa', borderRadius: '12px', background: '#fdfdfd', cursor: 'pointer' }}>
              {mediaPickerType === 'polaroid' ? <ImageIcon size={28} color="#888" /> : <VideoIcon size={28} color="#888" />}
              <div style={{ fontSize: '0.85rem', marginTop: '6px', color: '#888', fontFamily: 'var(--font-ui)', fontWeight: 700 }}>Frameless</div>
            </button>
          </div>
        )}
        
        {menuOpen && !showStickerPicker && !showNotePicker && !showEnvelopePicker && !showBouquetPicker && !mediaPickerType && (
          <div className="fab-menu">
            <button onClick={() => setShowNotePicker(true)} title="Add Note"><Type size={20} /></button>
            <button onClick={() => setMediaPickerType('polaroid')} title="Add Photo"><ImageIcon size={20} /></button>
            <button onClick={() => addItem('audio')} title="Add Voice Note"><Mic size={20} /></button>
            <button onClick={() => setMediaPickerType('video')} title="Add Video Clip"><VideoIcon size={20} /></button>
            <button onClick={() => setShowStickerPicker(true)} title="Add Cute Sticker"><Sparkles size={20} /></button>
            <button onClick={() => setShowEnvelopePicker(true)} title="Add Open When Envelope"><Mail size={20} /></button>
            <button onClick={() => addItem('music')} title="Add Spotify/YouTube Music"><Music size={20} /></button>
            <button onClick={() => setShowBouquetPicker(true)} title="Add Virtual Bouquet"><Gift size={20} /></button>
          </div>
        )}
        <button className="fab-main" onClick={() => {
          if (showStickerPicker || showNotePicker || showEnvelopePicker || showBouquetPicker || mediaPickerType) {
            setShowStickerPicker(false);
            setShowNotePicker(false);
            setShowEnvelopePicker(false);
            setShowBouquetPicker(false);
            setMediaPickerType(null);
          } else {
            setMenuOpen(!menuOpen);
          }
        }}>
          <Plus size={28} className={menuOpen || showStickerPicker || showNotePicker || showEnvelopePicker || showBouquetPicker || mediaPickerType ? 'rotate' : ''} />
        </button>
      </div>
    </div>
  );
};

export default PinboardCanvas;
