import React, { useState, useEffect } from 'react';
import { FaPhone, FaPhoneSlash } from 'react-icons/fa';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';

const FakeCall = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [caller, setCaller] = useState('Mom');
  const [customCaller, setCustomCaller] = useState('');
  const [delay, setDelay] = useState(0);

  const startFakeCall = () => {
    setTimeout(() => {
      setIsCallActive(true);
      // Play ringtone if available
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance('Incoming call');
        speechSynthesis.speak(utterance);
      }
    }, delay * 1000);
  };

  const endCall = () => {
    setIsCallActive(false);
  };

  const callerOptions = ['Mom', 'Dad', 'Boss', 'Doctor', 'Friend'];

  return (
    <>
      <Navbar />
      {!isCallActive ? (
        <div style={{minHeight: '100vh', paddingTop: '100px', paddingBottom: '20px'}}>
          <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card shadow-lg" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
                <div className="card-body text-center text-white p-5">
                  <h2 className="mb-4">📞 Fake Call</h2>
                  <p className="mb-4">Create a fake incoming call to escape uncomfortable situations</p>
                  
                  <div className="mb-3">
                    <label className="form-label">Caller Name:</label>
                    <select 
                      className="form-select"
                      value={caller}
                      onChange={(e) => setCaller(e.target.value)}
                    >
                      {callerOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                      <option value="custom">Custom</option>
                    </select>
                  </div>

                  {caller === 'custom' && (
                    <div className="mb-3">
                      <input 
                        type="text"
                        className="form-control"
                        placeholder="Enter caller name"
                        value={customCaller}
                        onChange={(e) => setCustomCaller(e.target.value)}
                      />
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="form-label">Delay (seconds):</label>
                    <select 
                      className="form-select"
                      value={delay}
                      onChange={(e) => setDelay(Number(e.target.value))}
                    >
                      <option value={0}>Immediate</option>
                      <option value={5}>5 seconds</option>
                      <option value={10}>10 seconds</option>
                      <option value={30}>30 seconds</option>
                    </select>
                  </div>
                  
                  <button 
                    className="btn btn-light btn-lg"
                    onClick={startFakeCall}
                  >
                    📱 Start Fake Call
                  </button>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      ) : (
        <div className="fake-call-screen">
          <div className="call-interface">
            <div className="caller-info">
              <div className="caller-avatar">
                <div className="avatar-circle">
                  {(caller === 'custom' ? customCaller : caller).charAt(0)}
                </div>
              </div>
              <h2 className="caller-name">{caller === 'custom' ? customCaller : caller}</h2>
              <p className="call-status">Incoming call...</p>
            </div>
            
            <div className="call-actions">
              <button className="btn-answer" onClick={endCall}>
                <FaPhone size={30} />
              </button>
              <button className="btn-decline" onClick={endCall}>
                <FaPhoneSlash size={30} />
              </button>
            </div>
          </div>
          
          <style jsx>{`
            .fake-call-screen {
              position: fixed;
              top: 0;
              left: 0;
              width: 100vw;
              height: 100vh;
              background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
              z-index: 9999;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            
            .call-interface {
              text-align: center;
              color: white;
            }
            
            .caller-avatar {
              margin-bottom: 20px;
            }
            
            .avatar-circle {
              width: 120px;
              height: 120px;
              border-radius: 50%;
              background: rgba(255,255,255,0.2);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 48px;
              font-weight: bold;
              margin: 0 auto;
            }
            
            .caller-name {
              font-size: 32px;
              margin: 20px 0 10px;
            }
            
            .call-status {
              font-size: 18px;
              opacity: 0.8;
              margin-bottom: 60px;
            }
            
            .call-actions {
              display: flex;
              justify-content: space-around;
              max-width: 200px;
              margin: 0 auto;
            }
            
            .btn-answer, .btn-decline {
              width: 70px;
              height: 70px;
              border-radius: 50%;
              border: none;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              transition: all 0.3s ease;
            }
            
            .btn-answer {
              background: #4CAF50;
              color: white;
            }
            
            .btn-decline {
              background: #f44336;
              color: white;
            }
            
            .btn-answer:hover, .btn-decline:hover {
              transform: scale(1.1);
            }
          `}</style>
        </div>
      )}
      <Footer />
    </>
  );
};

export default FakeCall;