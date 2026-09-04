import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

const avatars = ['🐨', '🦊', '🐰', '🐯', '🐼', '🐸', '🐶', '🐱', '🦋', '🐥', '🦄', '🐧'];

const UserSetupModal = ({ onComplete }) => {
  const users = useQuery(api.users.get);
  const addUser = useMutation(api.users.add);

  const [showNewForm, setShowNewForm] = useState(false);
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);

  useEffect(() => {
    if (users !== undefined && users.length === 0) {
      setShowNewForm(true);
    }
  }, [users]);

  const handleSelectUser = (user) => {
    onComplete(user);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name.trim()) {
      const newUser = await addUser({ name: name.trim(), avatar: selectedAvatar });
      onComplete(newUser);
    }
  };

  if (users === undefined) {
    return null; // Loading state
  }

  return (
    <div className="modal-overlay">
      <div className="user-setup-modal">
        <div style={{ fontSize: '2.5rem', marginBottom: '10px', lineHeight: 1 }}>📌</div>
        <h2>Who's adding memories?</h2>
        
        {!showNewForm && users.length > 0 ? (
          <div className="saved-users-list">
            <p>Select your profile or create a new one!</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', maxHeight: '200px', overflowY: 'auto' }}>
              {users.map((user, index) => (
                <div 
                  key={user._id || index} 
                  className="saved-user-btn"
                  onClick={() => handleSelectUser(user)}
                >
                  <span className="avatar">{user.avatar}</span>
                  <span className="name">{user.name}</span>
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
            
            {users.length > 0 && (
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
