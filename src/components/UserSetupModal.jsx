import React, { useState, useEffect } from 'react';

const avatars = ['🐨', '🦊', '🐰', '🐯', '🐼', '🐸', '🐶', '🐱', '🦋', '🐥', '🦄', '🐧'];

const UserSetupModal = ({ onComplete }) => {
  const [savedUsers, setSavedUsers] = useState([]);
  const [showNewForm, setShowNewForm] = useState(false);
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);

  useEffect(() => {
    const saved = localStorage.getItem('mandy_journal_saved_users');
    if (saved) {
      const parsed = JSON.parse(saved);
      setSavedUsers(parsed);
      if (parsed.length === 0) setShowNewForm(true);
    } else {
      setShowNewForm(true);
    }
  }, []);

  const handleSelectUser = (user) => {
    onComplete(user);
  };

  const handleDeleteUser = (e, indexToDelete) => {
    e.stopPropagation();
    const newSaved = savedUsers.filter((_, i) => i !== indexToDelete);
    setSavedUsers(newSaved);
    localStorage.setItem('mandy_journal_saved_users', JSON.stringify(newSaved));
    if (newSaved.length === 0) setShowNewForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      const newUser = { name: name.trim(), avatar: selectedAvatar };
      const newSaved = [...savedUsers, newUser];
      localStorage.setItem('mandy_journal_saved_users', JSON.stringify(newSaved));
      onComplete(newUser);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="user-setup-modal">
        <div style={{ fontSize: '2.5rem', marginBottom: '10px', lineHeight: 1 }}>📌</div>
        <h2>Who's adding memories?</h2>
        
        {!showNewForm && savedUsers.length > 0 ? (
          <div className="saved-users-list">
            <p>Select your profile or create a new one!</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {savedUsers.map((user, index) => (
                <div 
                  key={index} 
                  className="saved-user-btn"
                  onClick={() => handleSelectUser(user)}
                >
                  <span className="avatar">{user.avatar}</span>
                  <span className="name">{user.name}</span>
                  <button 
                    className="delete-user-btn" 
                    onClick={(e) => handleDeleteUser(e, index)}
                    title="Delete User"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <button className="start-btn" onClick={() => setShowNewForm(true)} style={{ background: '#f0f0f0', color: '#333' }}>
              + Add New User
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p>Pick an avatar and enter your name to start decorating the board!</p>
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
            
            {savedUsers.length > 0 && (
              <button type="button" className="cancel-btn" onClick={() => setShowNewForm(false)}>
                Cancel
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default UserSetupModal;
