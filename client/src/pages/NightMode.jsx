import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/auth';
import toast from 'react-hot-toast';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';

const NightMode = () => {
  const [isNightMode, setIsNightMode] = useState(false);
  const [autoMode, setAutoMode] = useState(true);
  const [features, setFeatures] = useState({
    flashlight: false,
    loudAlarm: false,
    autoShare: false,
    quickDial: false
  });
  const [auth] = useAuth();

  useEffect(() => {
    if (autoMode) {
      const hour = new Date().getHours();
      const shouldBeNight = hour >= 20 || hour <= 6;
      if (shouldBeNight !== isNightMode) {
        setIsNightMode(shouldBeNight);
        if (shouldBeNight) {
          toast.info('🌙 Night mode activated automatically');
        }
      }
    }
  }, [autoMode, isNightMode]);

  const toggleFlashlight = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      const track = stream.getVideoTracks()[0];
      
      if (track.getCapabilities().torch) {
        await track.applyConstraints({
          advanced: [{ torch: !features.flashlight }]
        });
        setFeatures(prev => ({ ...prev, flashlight: !prev.flashlight }));
        toast.success(features.flashlight ? '🔦 Flashlight OFF' : '🔦 Flashlight ON');
      } else {
        toast.error('Flashlight not available on this device');
      }
    } catch (error) {
      toast.error('Cannot access flashlight');
    }
  };

  const playLoudAlarm = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance('HELP! EMERGENCY! HELP!');
      utterance.rate = 1.5;
      utterance.pitch = 2;
      utterance.volume = 1;
      speechSynthesis.speak(utterance);
    }
    
    // Create loud beeping sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 1000;
    gainNode.gain.value = 0.3;
    
    oscillator.start();
    setTimeout(() => oscillator.stop(), 3000);
    
    setFeatures(prev => ({ ...prev, loudAlarm: !prev.loudAlarm }));
    toast.success('🚨 Loud alarm activated!');
  };

  const shareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const message = `🌙 Night Mode Alert: I'm at https://maps.google.com/maps?q=${latitude},${longitude}`;
        
        if (navigator.share) {
          navigator.share({
            title: 'My Location - Night Mode',
            text: message
          });
        } else {
          navigator.clipboard.writeText(message);
          toast.success('📍 Location copied to clipboard');
        }
      });
    }
    setFeatures(prev => ({ ...prev, autoShare: !prev.autoShare }));
  };

  return (
    <>
      <Navbar />
      <div style={{minHeight: '100vh', paddingTop: '100px', paddingBottom: '20px'}}>
        <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div 
            className="card shadow-lg" 
            style={{
              background: isNightMode 
                ? 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)' 
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            <div className="card-body text-white p-4">
              <div className="text-center mb-4">
                <h2>🌙 Night Mode Safety</h2>
                <p>Enhanced protection for nighttime activities</p>
              </div>
              
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="form-check form-switch">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      checked={isNightMode}
                      onChange={(e) => setIsNightMode(e.target.checked)}
                    />
                    <label className="form-check-label">
                      Night Mode {isNightMode ? 'ON' : 'OFF'}
                    </label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-check form-switch">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      checked={autoMode}
                      onChange={(e) => setAutoMode(e.target.checked)}
                    />
                    <label className="form-check-label">
                      Auto Mode (8PM-6AM)
                    </label>
                  </div>
                </div>
              </div>

              {isNightMode && (
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <div className="card bg-dark">
                      <div className="card-body text-center">
                        <h5>🔦 Flashlight</h5>
                        <button 
                          className={`btn ${features.flashlight ? 'btn-warning' : 'btn-outline-light'}`}
                          onClick={toggleFlashlight}
                        >
                          {features.flashlight ? 'Turn OFF' : 'Turn ON'}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <div className="card bg-dark">
                      <div className="card-body text-center">
                        <h5>🚨 Loud Alarm</h5>
                        <button 
                          className="btn btn-danger"
                          onClick={playLoudAlarm}
                        >
                          Activate Alarm
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <div className="card bg-dark">
                      <div className="card-body text-center">
                        <h5>📍 Share Location</h5>
                        <button 
                          className="btn btn-info"
                          onClick={shareLocation}
                        >
                          Share Now
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <div className="card bg-dark">
                      <div className="card-body text-center">
                        <h5>📞 Quick Dial</h5>
                        <button 
                          className="btn btn-success"
                          onClick={() => window.location.href = 'tel:100'}
                        >
                          Call 100
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {!isNightMode && (
                <div className="text-center">
                  <p className="text-light">Enable night mode to access enhanced safety features</p>
                </div>
              )}
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

export default NightMode;