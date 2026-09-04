import React, { useState, useEffect } from 'react';
import { LogOut, MonitorSmartphone } from 'lucide-react';
import PinboardCanvas from './components/PinboardCanvas';
import UserSetupModal from './components/UserSetupModal';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  if (isMobile) {
    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        background: 'var(--bg-color)', color: 'var(--text-primary)', zIndex: 99999,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '2rem', textAlign: 'center', fontFamily: 'var(--font-ui)'
      }}>
        <MonitorSmartphone size={64} style={{ marginBottom: '1rem', color: '#ff6b6b' }} />
        <h1 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Larger Screen Required</h1>
        <p style={{ fontSize: '1.2rem', lineHeight: 1.5, opacity: 0.8 }}>
          This digital scrapbook is best experienced on a larger screen to ensure all memories are displayed beautifully. 
          <br /><br />
          Please open this site on a laptop or iPad!
        </p>
      </div>
    );
  }

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
