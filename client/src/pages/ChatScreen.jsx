import React, { useState, useEffect } from "react";
import { useAuth } from '../context/auth';
import toast from 'react-hot-toast';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';

const ChatScreen = () => {
  const [auth] = useAuth();
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState('');
  const [emergencyId, setEmergencyId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  
  // Get user's emergency ID
  useEffect(() => {
    const fetchUserEmergency = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/v1/emergency`);
        if (res.ok) {
          const data = await res.json();
          // Find user's most recent emergency
          const userEmergencies = data.filter(em => em.userId === auth?.user?._id);
          if (userEmergencies.length > 0) {
            // Get the most recent emergency
            const latestEmergency = userEmergencies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
            console.log('Using emergency ID:', latestEmergency._id);
            setEmergencyId(latestEmergency._id);
            setIsConnected(true);
            fetchChats(latestEmergency._id);
          } else {
            console.log('No emergencies found for user:', auth?.user?._id);
            setIsConnected(false);
          }
        }
      } catch (error) {
        console.error('Error fetching emergency:', error);
        setIsConnected(false);
      }
    };
    
    if (auth?.user?._id) {
      fetchUserEmergency();
    }
  }, [auth]);
  
  const fetchChats = async (emergId) => {
    try {
      const res = await fetch(`http://localhost:5001/api/v1/chats/emergency/${emergId}`);
      if (res.ok) {
        const data = await res.json();
        console.log('All emergency chats:', data);
        setChats(data || []);
      } else {
        console.log('No chats found or error:', res.status);
        setChats([]);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };
  
  const sendMessage = async () => {
    console.log('Send button clicked');
    console.log('Message:', message);
    console.log('Emergency ID:', emergencyId);
    console.log('User ID:', auth?.user?._id);
    
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }
    
    if (!emergencyId) {
      toast.error('No emergency found. Please trigger an emergency first.');
      return;
    }
    
    try {
      const payload = {
        senderId: auth?.user?._id,
        receiverId: 'admin',
        text: message,
        emergId: emergencyId
      };
      
      console.log('Sending payload:', payload);
      
      const res = await fetch('http://localhost:5001/api/v1/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      console.log('Response status:', res.status);
      
      if (res.ok) {
        const result = await res.json();
        console.log('Response data:', result);
        setMessage('');
        fetchChats(emergencyId);
        toast.success('Message sent successfully!');
      } else {
        const errorText = await res.text();
        console.error('Server error:', errorText);
        toast.error('Failed to send message: ' + res.status);
      }
    } catch (error) {
      console.error('Network error:', error);
      toast.error('Network error: ' + error.message);
    }
  };
  
  // Auto-refresh chats every 3 seconds
  useEffect(() => {
    if (emergencyId) {
      const interval = setInterval(() => fetchChats(emergencyId), 3000);
      return () => clearInterval(interval);
    }
  }, [emergencyId]);
  
  return (
    <>
      <Navbar />
      <div className="min-vh-100" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', paddingTop: '100px'}}>
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-xl-6">
              
              {/* Chat Header */}
              <div className="card shadow-lg border-0 mb-4">
                <div className="card-header bg-danger text-white text-center py-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <div className="bg-white rounded-circle p-2 me-3">
                        <i className="fas fa-shield-alt text-danger fs-4"></i>
                      </div>
                      <div>
                        <h5 className="mb-0 fw-bold">🚨 Emergency Support</h5>
                        <small className="opacity-75">
                          {isConnected ? 'Connected to Emergency Services' : 'Not Connected'}
                        </small>
                      </div>
                    </div>
                    <div className="text-end">
                      <div className={`badge ${isConnected ? 'bg-success' : 'bg-warning'} fs-6`}>
                        {isConnected ? '● Online' : '● Offline'}
                      </div>
                      <div className="small mt-1">ID: {emergencyId ? emergencyId.slice(-6) : 'None'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Connection Status */}
              {!isConnected && (
                <div className="alert alert-warning text-center mb-4">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  <strong>No Active Emergency</strong><br/>
                  <small>Please trigger an emergency from the Emergency page to start chatting with support.</small>
                  <div className="mt-2">
                    <a href="/emergency" className="btn btn-warning btn-sm">
                      <i className="fas fa-siren me-1"></i> Trigger Emergency
                    </a>
                  </div>
                </div>
              )}

              {/* Chat Container */}
              <div className="card shadow-lg border-0">
                <div className="card-body p-0">
                  
                  {/* Messages Area */}
                  <div className="chat-messages p-3" style={{height: '400px', overflowY: 'auto', background: '#f8f9fa'}}>
                    {chats.length === 0 ? (
                      <div className="text-center text-muted py-4">
                        <i className="fas fa-comments fs-3 mb-2 opacity-50"></i>
                        <h6>No messages yet</h6>
                        <p className="small">Emergency support will respond here.</p>
                      </div>
                    ) : (
                      chats.map((chat, index) => {
                        const isMyMessage = chat.sender === auth?.user?._id;
                        const isFromAdmin = chat.sender && chat.sender.toString().startsWith('admin-');
                        return (
                          <div key={index} className={`d-flex mb-2 ${isMyMessage ? 'justify-content-end' : 'justify-content-start'}`}>
                            <div style={{
                              maxWidth: '70%',
                              padding: '8px 12px',
                              borderRadius: isMyMessage ? '15px 15px 5px 15px' : '15px 15px 15px 5px',
                              backgroundColor: isMyMessage ? '#007bff' : isFromAdmin ? '#28a745' : '#6c757d',
                              color: 'white',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                            }}>
                              <div className="message-text">
                                <div className="mb-1">{chat.textChat || 'No message'}</div>
                                <div className="d-flex justify-content-between align-items-center">
                                  <small style={{fontSize: '0.75rem', opacity: 0.8}}>
                                    {isMyMessage ? 'You' : isFromAdmin ? 'Admin' : 'User'}
                                  </small>
                                  <small style={{fontSize: '0.7rem', opacity: 0.7}}>
                                    {chat.createdAt ? new Date(chat.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'now'}
                                  </small>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Message Input Area */}
                  <div className="card-footer bg-white border-0 p-4">
                    <div className="row mb-2">
                      <div className="col">
                        <button 
                          className="btn btn-outline-warning btn-sm"
                          onClick={() => {
                            setChats([]);
                            toast.success('Chat view cleared');
                          }}
                        >
                          <i className="fas fa-broom me-1"></i> Clear View
                        </button>
                      </div>
                    </div>
                    
                    <div className="input-group">
                      <input 
                        type="text"
                        className="form-control" 
                        placeholder="Type your emergency message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        disabled={!isConnected}
                        style={{borderRadius: '20px 0 0 20px'}}
                      />
                      <button 
                        className="btn btn-danger"
                        onClick={sendMessage}
                        disabled={!message.trim() || !isConnected}
                        style={{borderRadius: '0 20px 20px 0'}}
                      >
                        Send
                      </button>
                    </div>
                    
                    {isConnected && (
                      <div className="text-center mt-2">
                        <small className="text-muted">
                          <i className="fas fa-shield-alt me-1"></i>
                          Your messages are secure and monitored by emergency services
                        </small>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Emergency Actions */}
              {isConnected && (
                <div className="card shadow border-0 mt-4">
                  <div className="card-body text-center py-3">
                    <h6 className="text-muted mb-3">Quick Emergency Actions</h6>
                    <div className="row g-2">
                      <div className="col-4">
                        <a href="tel:100" className="btn btn-outline-danger btn-sm w-100">
                          <i className="fas fa-phone me-1"></i><br/>
                          <small>Police</small>
                        </a>
                      </div>
                      <div className="col-4">
                        <a href="tel:181" className="btn btn-outline-danger btn-sm w-100">
                          <i className="fas fa-phone me-1"></i><br/>
                          <small>Women Help</small>
                        </a>
                      </div>
                      <div className="col-4">
                        <a href="/emergency" className="btn btn-outline-warning btn-sm w-100">
                          <i className="fas fa-siren me-1"></i><br/>
                          <small>New SOS</small>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ChatScreen;