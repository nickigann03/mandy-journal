import React, { useState } from 'react';

const avatars = ['🐨', '🦊', '🐰', '🐯', '🐼', '🐸', '🐶', '🐱', '🦋', '🐥', '🦄', '🐧'];

const UserSetupModal = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onComplete({ name: name.trim(), avatar: selectedAvatar });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="user-setup-modal">
        <h2>Who's adding memories? 📌</h2>
        <p>Pick an avatar and enter your name to start decorating the board!</p>
        
        <form onSubmit={handleSubmit}>
          <div className="avatar-grid">
            {avatars.map(avatar => (
              <button
                type="button"
                key={avatar}
                className={`avatar-btn ${selectedAvatar === avatar ? 'selected' : ''}`}
                onClick={() => setSelectedAvatar(avatar)}
              >
                {avatar}
              </button>
            ))}
          </div>
          
          <input 
            type="text" 
            placeholder="Your Name (e.g. Nicki)" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={15}
            className="name-input"
            required
            autoFocus
          />
          
          <button type="submit" className="start-btn" disabled={!name.trim()}>
            Join the Board
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserSetupModal;
