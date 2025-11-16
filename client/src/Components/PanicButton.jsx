import React, { useState } from 'react';
import { useAuth } from '../context/auth';
import { triggerEmergency } from '../utils/emergencyUtils';

const PanicButton = () => {
  const [isPressed, setIsPressed] = useState(false);
  const [auth] = useAuth();

  const handlePanic = async () => {
    setIsPressed(true);
    await triggerEmergency(auth);
    setTimeout(() => setIsPressed(false), 2000);
  };

  return (
    <div 
      className="panic-button-widget"
      style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        zIndex: 1000,
        width: '60px',
        height: '60px'
      }}
    >
      <button
        className={`panic-btn ${isPressed ? 'pressed' : ''}`}
        onClick={handlePanic}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          border: 'none',
          background: isPressed ? '#ff1744' : 'linear-gradient(135deg, #ff4757, #ff3742)',
          color: 'white',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(255, 71, 87, 0.6)',
          transition: 'all 0.3s ease',
          transform: isPressed ? 'scale(0.9)' : 'scale(1)',
          animation: isPressed ? 'pulse 0.5s infinite' : 'none'
        }}
        onMouseEnter={(e) => {
          if (!isPressed) {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.boxShadow = '0 6px 25px rgba(255, 71, 87, 0.8)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isPressed) {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 20px rgba(255, 71, 87, 0.6)';
          }
        }}
      >
        🚨
      </button>
      
      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(0.9); }
          50% { transform: scale(1.1); }
          100% { transform: scale(0.9); }
        }
        
        .panic-btn:active {
          transform: scale(0.8) !important;
        }
      `}</style>
    </div>
  );
};

export default PanicButton;