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
  const [mediaPickerType, setMediaPickerType] = useState(null); // 'polaroid' | 'video' | 'audio' | 'music'
  
  const [showMobileWarning, setShowMobileWarning] = useState(typeof window !== 'undefined' && window.innerWidth < 1024);

  const wrapperRef = useRef(null);

  useEffect(() => {
    if (wrapperRef.current) {
      const center = Math.max(1400, window.innerWidth) / 2;
      wrapperRef.current.scrollTop = 0;
      wrapperRef.current.scrollLeft = center - window.innerWidth / 2;
    }
  }, []);

  const [placementMode, setPlacementMode] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (placementMode) {
      setMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleCanvasClick = (e) => {
    if (!placementMode) return;
    
    // Ignore clicks on buttons/menus that might bubble up
    if (e.target.closest('.fab-container')) return;

    const rect = wrapperRef.current.getBoundingClientRect();
    // Offset by roughly half the card size so it drops centered on the cursor
    const x = Math.max(0, e.clientX - rect.left + wrapperRef.current.scrollLeft - 130);
    const y = Math.max(0, e.clientY - rect.top + wrapperRef.current.scrollTop - 150);

    const { type, options } = placementMode;
    const position = { x, y };
    const newItem = { type, position };
    
    if (currentUser) {
      newItem.creatorName = currentUser.name;
      newItem.creatorAvatar = currentUser.avatar;
    }

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
      newItem.imageSrc = options;
    } else if (type === 'open_when') {
      newItem.color = options?.color || 'white';
    } else if (type === 'bouquet') {
      newItem.imageSrc = options;
    }

    addItemMutation(newItem);
    setPlacementMode(null);
  };

  const addItem = (type, options = null) => {
    setPlacementMode({ type, options });
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
    <div className={`pinboard-wrapper ${placementMode ? 'placement-mode' : ''}`} ref={wrapperRef} onClick={handleCanvasClick} onMouseMove={handleMouseMove} style={{ cursor: placementMode ? 'crosshair' : 'default' }}>
      
      {showMobileWarning && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(255, 218, 224, 0.6)', backdropFilter: 'blur(8px)',
          zIndex: 10001, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Quicksand', sans-serif"
        }}>
          <div style={{
            background: 'white', padding: '30px 20px', borderRadius: '20px',
            textAlign: 'center', maxWidth: '320px', border: '3px solid var(--text-primary)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
          }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '10px', lineHeight: 1 }}>📱</span>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '10px', color: 'var(--text-primary)' }}>Larger Screen Recommended</h2>
            <p style={{ fontSize: '1.1rem', color: '#555', marginBottom: '20px', fontWeight: '600', lineHeight: 1.4 }}>
              This is best viewed on a laptop or iPad! You can still scroll around for now, but things might be a bit cramped.
            </p>
            <button 
              onClick={(e) => { e.stopPropagation(); setShowMobileWarning(false); }}
              style={{
                width: '100%', padding: '12px', background: 'var(--text-primary)', color: 'white',
                border: 'none', borderRadius: '12px', fontSize: '1.1rem', fontWeight: '700', cursor: 'pointer'
              }}
            >
              Got it, continue
            </button>
          </div>
        </div>
      )}

      {placementMode && (
        <div style={{
          position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.8)', color: 'white', padding: '12px 24px',
          borderRadius: '30px', zIndex: 9999, pointerEvents: 'none',
          display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
        }}>
          <Sparkles size={18} />
          <span>Tap anywhere to place your {placementMode.type}</span>
        </div>
      )}

      {placementMode && mousePos.x !== 0 && (
        <div style={{
          position: 'fixed', left: mousePos.x, top: mousePos.y, 
          width: '40px', height: '40px', borderRadius: '50%', 
          background: 'rgba(255,107,129,0.3)', border: '2px dashed #ff4757',
          transform: 'translate(-50%, -50%)', pointerEvents: 'none', zIndex: 9998
        }} />
      )}

      <div className="pinboard-canvas">
        <div className="board-title" style={{ position: 'absolute', top: 40, left: '50%', transform: 'translateX(-50%)', fontSize: '2.5rem', opacity: 0.8, pointerEvents: 'none', zIndex: 10, whiteSpace: 'nowrap' }}>
          Dearest Mandy,
        </div>
        {items.map(item => {
          const canDelete = !item.creatorName || (currentUser && item.creatorName === currentUser.name);
          const commonProps = {
            id: item._id, defaultPosition: item.position,
            onUpdatePosition: handleUpdatePosition, 
            onDelete: canDelete ? handleDelete : null,
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
