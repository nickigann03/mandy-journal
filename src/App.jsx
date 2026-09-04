import React, { useState, useEffect } from 'react';
import { LogOut, MonitorSmartphone } from 'lucide-react';
import PinboardCanvas from './components/PinboardCanvas';
import UserSetupModal from './components/UserSetupModal';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('mandy_journal_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleUserSetup = (user) => {
    localStorage.setItem('mandy_journal_user', JSON.stringify(user));
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('mandy_journal_user');
    setCurrentUser(null);
  };

  return (
    <div className="app-container">
      {!currentUser && <UserSetupModal onComplete={handleUserSetup} />}
      
      {currentUser && (
        <button 
          className="switch-user-btn" 
          onClick={handleLogout} 
          title="Change User"
        >
          <span>{currentUser.avatar}</span>
          <span style={{ fontSize: '1rem', marginRight: '4px' }}>Change User</span>
          <LogOut size={14} />
        </button>
      )}

      <PinboardCanvas currentUser={currentUser} />
    </div>
  );
}

export default App;
