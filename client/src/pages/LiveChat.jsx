import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/auth';
import toast from 'react-hot-toast';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';

const LiveChat = () => {
  const [auth] = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check if user is admin (you can modify this logic)
  useEffect(() => {
    if (auth?.user?.email === 'admin@admin.com' || auth?.user?.role === 1) {
      setIsAdmin(true);
    }
  }, [auth]);

  // Load messages from localStorage
  useEffect(() => {
    const savedMessages = JSON.parse(localStorage.getItem('liveChat') || '[]');
    setMessages(savedMessages);
  }, []);

  // Auto-refresh messages every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const savedMessages = JSON.parse(localStorage.getItem('liveChat') || '[]');
      setMessages(savedMessages);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const sendMessage = () => {
    if (!newMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }

    const message = {
      id: Date.now(),
      text: newMessage,
      sender: isAdmin ? 'Admin' : auth?.user?.uname || 'User',
      senderId: auth?.user?._id,
      isAdmin: isAdmin,
      timestamp: new Date().toLocaleTimeString(),
      createdAt: new Date().toISOString()
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    localStorage.setItem('liveChat', JSON.stringify(updatedMessages));
    
    setNewMessage('');
    toast.success('Message sent!');
  };

  const clearChat = () => {
    if (window.confirm('Clear all messages?')) {
      setMessages([]);
      localStorage.removeItem('liveChat');
      toast.success('Chat cleared');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card" style={{height: '600px'}}>
              <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  💬 Live Chat {isAdmin ? '(Admin Panel)' : '(User)'}
                </h5>
                <div>
                  <small className="me-3">Auto-refresh: 2s</small>
                  {isAdmin && (
                    <button className="btn btn-sm btn-outline-light" onClick={clearChat}>
                      Clear Chat
                    </button>
                  )}
                </div>
              </div>
              
              <div className="card-body" style={{height: '450px', overflowY: 'auto', padding: '20px'}}>
                {messages.length === 0 ? (
                  <div className="text-center text-muted mt-5">
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className={`d-flex mb-3 ${msg.senderId === auth?.user?._id ? 'justify-content-end' : 'justify-content-start'}`}>
                      <div className={`p-3 rounded ${msg.senderId === auth?.user?._id ? 'bg-primary text-white' : 'bg-light'}`} style={{maxWidth: '70%'}}>
                        <p className="mb-1">{msg.text}</p>
                        <small className={msg.senderId === auth?.user?._id ? 'text-light' : 'text-muted'}>
                          {msg.sender} • {msg.timestamp}
                        </small>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="card-footer">
                <div className="d-flex">
                  <input
                    type="text"
                    className="form-control me-2"
                    placeholder={`Type your message as ${isAdmin ? 'Admin' : 'User'}...`}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <button 
                    className="btn btn-primary" 
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="row mt-4">
          <div className="col-md-8 mx-auto">
            <div className="alert alert-info">
              <h6>How to test:</h6>
              <ul className="mb-0">
                <li><strong>Admin:</strong> Login with admin@admin.com or set role=1</li>
                <li><strong>User:</strong> Login with any other account</li>
                <li><strong>Live Chat:</strong> Messages sync every 2 seconds between admin and user</li>
                <li><strong>Multiple Tabs:</strong> Open this page in different tabs to simulate admin/user</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LiveChat;