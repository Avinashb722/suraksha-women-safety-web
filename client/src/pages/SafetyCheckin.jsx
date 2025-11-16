import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/auth';
import { triggerEmergency } from '../utils/emergencyUtils';
import toast from 'react-hot-toast';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';

const SafetyCheckin = () => {
  const [isActive, setIsActive] = useState(false);
  const [interval, setInterval] = useState(30);
  const [lastCheckin, setLastCheckin] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [auth] = useAuth();

  useEffect(() => {
    let timer;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Time's up - trigger emergency
            triggerEmergency(auth);
            toast.error('⚠️ Safety check-in missed! Emergency triggered!');
            setIsActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft, auth]);

  const startCheckin = () => {
    setIsActive(true);
    setTimeLeft(interval * 60);
    setLastCheckin(new Date());
    toast.success(`✅ Safety check-in started! Next check-in in ${interval} minutes`);
  };

  const stopCheckin = () => {
    setIsActive(false);
    setTimeLeft(0);
    toast.info('Safety check-in stopped');
  };

  const confirmSafety = () => {
    setTimeLeft(interval * 60);
    setLastCheckin(new Date());
    toast.success('✅ Safety confirmed! Timer reset');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <Navbar />
      <div style={{minHeight: '100vh', paddingTop: '100px', paddingBottom: '20px'}}>
        <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
            <div className="card-body text-center text-white p-5">
              <h2 className="mb-4">⏰ Safety Check-in</h2>
              <p className="mb-4">Set automatic safety confirmations. If you don't check-in on time, emergency alerts will be sent.</p>
              
              {!isActive ? (
                <>
                  <div className="mb-4">
                    <label className="form-label">Check-in Interval:</label>
                    <select 
                      className="form-select"
                      value={interval}
                      onChange={(e) => setInterval(Number(e.target.value))}
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={60}>1 hour</option>
                      <option value={120}>2 hours</option>
                    </select>
                  </div>
                  
                  <button 
                    className="btn btn-light btn-lg"
                    onClick={startCheckin}
                  >
                    🚀 Start Safety Check-in
                  </button>
                </>
              ) : (
                <>
                  <div className="mb-4">
                    <div 
                      className="timer-display"
                      style={{
                        fontSize: '3rem',
                        fontWeight: 'bold',
                        color: timeLeft < 300 ? '#ffeb3b' : 'white'
                      }}
                    >
                      {formatTime(timeLeft)}
                    </div>
                    <p className="mb-3">Time until next check-in</p>
                    
                    {timeLeft < 300 && (
                      <div className="alert alert-warning">
                        <strong>⚠️ Warning!</strong> Less than 5 minutes left!
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-3">
                    <button 
                      className="btn btn-success btn-lg me-3"
                      onClick={confirmSafety}
                    >
                      ✅ I'm Safe
                    </button>
                    <button 
                      className="btn btn-secondary"
                      onClick={stopCheckin}
                    >
                      ⏹️ Stop
                    </button>
                  </div>
                  
                  {lastCheckin && (
                    <small className="text-light">
                      Last check-in: {lastCheckin.toLocaleTimeString()}
                    </small>
                  )}
                </>
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

export default SafetyCheckin;