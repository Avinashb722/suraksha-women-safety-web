import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Emergency.css";
import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";
import { useAuth } from "../context/auth";
import toast from "react-hot-toast";
import { triggerEmergency } from "../utils/emergencyUtils";
import axios from "axios";

const Emergency = () => {
  const [isActivated, setIsActivated] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [location, setLocation] = useState({ lat: null, long: null });
  const [locationStatus, setLocationStatus] = useState('detecting');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastEmergencyTime, setLastEmergencyTime] = useState(0);
  const [auth, setAuth] = useAuth();
  const [timer, setTimer] = useState(null);

  const handleEmergencyPress = async () => {
    // Prevent multiple clicks and auto-triggering
    if (isActivated || isProcessing) return;
    
    // Prevent rapid successive emergency calls (5 second cooldown)
    const now = Date.now();
    if (now - lastEmergencyTime < 5000) {
      toast.error('Please wait before sending another emergency alert');
      return;
    }
    
    setIsActivated(true);
    setCountdown(3);
    
    const newTimer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(newTimer);
          setTimer(null);
          sendEmergencyAlert();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    
    setTimer(newTimer);
  };

  const sendEmergencyAlert = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      const result = await triggerEmergency(auth);
      setLastEmergencyTime(Date.now());
      
      // Stop any further processing
      if (result) {
        toast.success('Emergency alert sent successfully!');
      }
    } catch (error) {
      console.error('Emergency failed:', error);
      toast.error('Emergency failed. Please try again.');
    } finally {
      // Reset all states to stop any continuous sending
      setIsActivated(false);
      setCountdown(null);
      setIsProcessing(false);
      if (timer) {
        clearInterval(timer);
        setTimer(null);
      }
    }
  };

  const cancelEmergency = () => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
    setIsActivated(false);
    setCountdown(null);
    setIsProcessing(false);
    toast.success('Emergency cancelled');
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [timer]);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            long: position.coords.longitude
          });
          setLocationStatus('found');
        },
        (error) => {
          setLocationStatus('error');
          toast.error('Location access required for emergency services');
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    } else {
      setLocationStatus('unsupported');
    }
  };

  const handleSmsToggle = async () => {
    if (isProcessing || !auth?.token) return;
    
    try {
      setIsProcessing(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      
      const response = await axios.put(
        `${apiUrl}/api/v1/users/toggle-sms`,
        {},
        {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        }
      );
      
      // Update auth context and localStorage
      const updatedAuth = {
        ...auth,
        user: {
          ...auth.user,
          twilioSmsEnabled: response.data.twilioSmsEnabled
        }
      };
      
      setAuth(updatedAuth);
      localStorage.setItem('auth', JSON.stringify(updatedAuth));
      
      toast.success(response.data.message);
    } catch (error) {
      console.error('SMS toggle error:', error);
      toast.error(error.response?.data?.message || 'Failed to toggle SMS setting');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="emergency-page">
        {/* All Content in Hero Section */}
        <section className="emergency-hero">
          <div className="hero-bg">
            <div className="gradient-orb orb-1"></div>
            <div className="gradient-orb orb-2"></div>
            <div className="gradient-orb orb-3"></div>
          </div>
          
          <div className="container">
            <div className="hero-content">
              <div className="hero-badge">
                <span className="badge-icon">🛡️</span>
                <span>Emergency Response System</span>
              </div>
              
              <h1 className="hero-title">
                Need Help?
                <span className="title-accent">We're Here</span>
              </h1>

              {/* Emergency Button */}
              <div className="emergency-center">
                <div className="emergency-button-zone">
                  <div className={`emergency-btn-wrapper ${isActivated ? 'activated' : ''}`}>
                    <div className="pulse-ring ring-1"></div>
                    <div className="pulse-ring ring-2"></div>
                    <div className="pulse-ring ring-3"></div>
                    <div className="pulse-ring ring-4"></div>
                    <div className="rotating-glow"></div>
                    
                    <button 
                      className={`main-emergency-btn ${isActivated ? 'active' : ''} ${locationStatus !== 'found' || isProcessing ? 'disabled' : ''}`}
                      onClick={handleEmergencyPress}
                      disabled={locationStatus !== 'found' || isProcessing || isActivated}
                    >
                      <div className="btn-glow-inner"></div>
                      <div className="btn-content-wrapper">
                        {countdown ? (
                          <div className="countdown-container">
                            <div className="countdown-circle">
                              <svg className="progress-ring" viewBox="0 0 120 120">
                                <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
                                <circle 
                                  cx="60" cy="60" r="54" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round"
                                  style={{
                                    strokeDasharray: '339.29',
                                    strokeDashoffset: `${339.29 - (339.29 * (4 - countdown) / 3)}`,
                                    transform: 'rotate(-90deg)', transformOrigin: '60px 60px',
                                    transition: 'stroke-dashoffset 1s linear'
                                  }}
                                />
                              </svg>
                              <div className="countdown-number">{countdown}</div>
                            </div>
                            <div className="countdown-label">Activating...</div>
                          </div>
                        ) : (
                          <div className="btn-main-content">
                            {isProcessing ? (
                              <div className="processing-state">
                                <span className="processing-text">SENDING...</span>
                              </div>
                            ) : (
                              <>
                                <div className="sos-section">
                                  <span className="sos-text">SOS</span>
                                  <div className="sos-line"></div>
                                </div>
                                <span className="emergency-label">EMERGENCY</span>
                                <div className="btn-icons">
                                  <span className="btn-icon">🚨</span>
                                  <span className="btn-icon">📞</span>
                                  <span className="btn-icon">📍</span>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </button>
                  </div>
                  
                  {isActivated && (
                    <div className="cancel-section">
                      <button className="cancel-emergency-btn" onClick={cancelEmergency}>
                        <span className="cancel-icon">✕</span>
                        <span>Cancel Emergency</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <p className="hero-description">
                Instant emergency response with real-time location tracking and 24/7 support
              </p>

              {/* Status Indicators */}
              <div className="status-grid">
                <div className={`status-card ${locationStatus}`}>
                  <div className="status-icon">📍</div>
                  <div className="status-info">
                    <span className="status-label">Location</span>
                    <span className="status-value">
                      {locationStatus === 'detecting' && 'Detecting...'}
                      {locationStatus === 'found' && 'Ready'}
                      {locationStatus === 'error' && 'Error'}
                    </span>
                  </div>
                </div>
                
                <div className="status-card found">
                  <div className="status-icon">🔒</div>
                  <div className="status-info">
                    <span className="status-label">Security</span>
                    <span className="status-value">Encrypted</span>
                  </div>
                </div>
                
                <div className="status-card found">
                  <div className="status-icon">⚡</div>
                  <div className="status-info">
                    <span className="status-label">Response</span>
                    <span className="status-value">5 Seconds</span>
                  </div>
                </div>
              </div>

              {/* SMS Toggle */}
              <div className="sms-toggle-section">
                <div className="sms-toggle-card">
                  <div className="sms-toggle-info">
                    <span className="sms-toggle-icon">📱</span>
                    <div className="sms-toggle-text">
                      <span className="sms-toggle-label">Twilio SMS Alerts</span>
                      <span className="sms-toggle-desc">Emergency SMS notifications</span>
                    </div>
                  </div>
                  <button 
                    className={`sms-toggle-btn ${(auth?.user?.twilioSmsEnabled !== false) ? 'enabled' : 'disabled'}`}
                    onClick={handleSmsToggle}
                    disabled={isProcessing || !auth?.token}
                  >
                    <div className="toggle-slider"></div>
                    <span className="toggle-text">
                      {(auth?.user?.twilioSmsEnabled !== false) ? 'ON' : 'OFF'}
                    </span>
                  </button>
                </div>
              </div>



              {/* Features */}
              <div className="features-section">
                <div className="features-grid">
                  <div className="feature-card">
                    <div className="feature-icon">⚡</div>
                    <h4>Instant Response</h4>
                    <p>Emergency alerts sent within 5 seconds to all contacts</p>
                  </div>
                  <div className="feature-card">
                    <div className="feature-icon">🌍</div>
                    <h4>GPS Tracking</h4>
                    <p>Real-time location sharing with emergency services</p>
                  </div>
                  <div className="feature-card">
                    <div className="feature-icon">🔐</div>
                    <h4>Secure & Private</h4>
                    <p>End-to-end encrypted emergency communications</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Emergency;