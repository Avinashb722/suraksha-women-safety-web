import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/auth';
import { triggerEmergency } from '../utils/emergencyUtils';
import toast from 'react-hot-toast';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';

const ShakeAlert = () => {
  const [isActive, setIsActive] = useState(false);
  const [shakeCount, setShakeCount] = useState(0);
  const [auth] = useAuth();

  useEffect(() => {
    let lastX, lastY, lastZ;
    let shakeThreshold = 15;
    let shakeTimeout;

    const handleMotion = (event) => {
      if (!isActive) return;

      const { x, y, z } = event.accelerationIncludingGravity;
      
      if (lastX !== undefined) {
        const deltaX = Math.abs(x - lastX);
        const deltaY = Math.abs(y - lastY);
        const deltaZ = Math.abs(z - lastZ);
        
        if (deltaX + deltaY + deltaZ > shakeThreshold) {
          setShakeCount(prev => prev + 1);
          
          clearTimeout(shakeTimeout);
          shakeTimeout = setTimeout(() => {
            setShakeCount(0);
          }, 1000);
        }
      }
      
      lastX = x;
      lastY = y;
      lastZ = z;
    };

    if (isActive && window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', handleMotion);
    }

    return () => {
      window.removeEventListener('devicemotion', handleMotion);
      clearTimeout(shakeTimeout);
    };
  }, [isActive]);

  useEffect(() => {
    if (shakeCount >= 3) {
      triggerEmergency(auth);
      setShakeCount(0);
      toast.success('🚨 Shake Alert Triggered!');
    }
  }, [shakeCount, auth]);

  return (
    <>
      <Navbar />
      <div style={{minHeight: '100vh', paddingTop: '100px', paddingBottom: '20px'}}>
        <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
            <div className="card-body text-center text-white p-5">
              <h2 className="mb-4">📳 Shake Alert</h2>
              <p className="mb-4">Shake your phone 3 times quickly to trigger emergency SOS</p>
              
              <div className="mb-4">
                <button 
                  className={`btn btn-lg ${isActive ? 'btn-danger' : 'btn-light'}`}
                  onClick={() => setIsActive(!isActive)}
                >
                  {isActive ? '🔴 Active' : '⚪ Inactive'}
                </button>
              </div>
              
              {isActive && (
                <div className="alert alert-warning">
                  <strong>Shake Detection Active</strong><br/>
                  Shake count: {shakeCount}/3
                </div>
              )}
              
              <small className="text-light">
                Enable this feature when you feel unsafe. Shake your phone to instantly send emergency alerts.
              </small>
            </div>
          </div>
        </div>
      </div>
        </div>
      </div>
    <Footer />
    </>
  );
};

export default ShakeAlert;