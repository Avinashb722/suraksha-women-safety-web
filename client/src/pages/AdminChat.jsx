import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/auth';
import toast from 'react-hot-toast';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';

const AdminChat = () => {
  const [auth] = useAuth();
  const [emergencies, setEmergencies] = useState([]);
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState('');

  // Fetch emergencies
  useEffect(() => {
    const fetchEmergencies = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/v1/emergency');
        if (res.ok) {
          const data = await res.json();
          setEmergencies(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        }
      } catch (error) {
        console.error('Error fetching emergencies:', error);
      }
    };
    fetchEmergencies();
    const interval = setInterval(fetchEmergencies, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch chats for selected emergency
  const fetchChats = async (emergencyId) => {
    try {
      const res = await fetch(`http://localhost:5001/api/v1/chats/emergency/${emergencyId}`);
      if (res.ok) {
        const data = await res.json();
        setChats(data || []);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  // Auto-refresh chats
  useEffect(() => {
    if (selectedEmergency) {
      fetchChats(selectedEmergency._id);
      const interval = setInterval(() => fetchChats(selectedEmergency._id), 2000);
      return () => clearInterval(interval);
    }
  }, [selectedEmergency]);

  // Send message
  const sendMessage = async () => {
    if (!message.trim() || !selectedEmergency) {
      toast.error('Please enter a message');
      return;
    }

    console.log('Sending message:', {
      senderId: auth?.user?._id,
      receiverId: selectedEmergency.userId,
      text: message,
      emergId: selectedEmergency._id
    });

    try {
      const res = await fetch('http://localhost:5001/api/v1/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: auth?.user?._id,
          receiverId: selectedEmergency.userId,
          text: message,
          emergId: selectedEmergency._id
        })
      });

      console.log('Response status:', res.status);
      
      if (res.ok) {
        const result = await res.json();
        console.log('Message sent successfully:', result);
        setMessage('');
        toast.success('Message sent!');
        setTimeout(() => fetchChats(selectedEmergency._id), 500);
      } else {
        const error = await res.text();
        console.error('Server error:', error);
        toast.error('Failed to send: ' + res.status);
      }
    } catch (error) {
      console.error('Network error:', error);
      toast.error('Network error: ' + error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div className="row">
          {/* Emergency List */}
          <div className="col-md-4">
            <div className="card">
              <div className="card-header">
                <h5>Active Emergencies</h5>
              </div>
              <div className="card-body" style={{height: '500px', overflowY: 'auto'}}>
                {emergencies.map((emergency) => (
                  <div 
                    key={emergency._id}
                    className={`p-2 mb-2 border rounded cursor-pointer ${selectedEmergency?._id === emergency._id ? 'bg-primary text-white' : 'bg-light'}`}
                    onClick={() => setSelectedEmergency(emergency)}
                    style={{cursor: 'pointer'}}
                  >
                    <strong>{emergency.username}</strong>
                    <br />
                    <small>{emergency.addressOfInc}</small>
                    <br />
                    <small>{new Date(emergency.createdAt).toLocaleString()}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="col-md-8">
            {selectedEmergency ? (
              <div className="card">
                <div className="card-header">
                  <h5>Chat with {selectedEmergency.username}</h5>
                  <small>Emergency: {selectedEmergency.addressOfInc}</small>
                  <br />
                  <small className="text-muted">Emergency ID: {selectedEmergency._id}</small>
                </div>
                <div className="card-body" style={{height: '400px', overflowY: 'auto'}}>
                  {chats.length === 0 ? (
                    <p className="text-muted text-center">No messages yet</p>
                  ) : (
                    chats.map((chat, index) => (
                      <div key={index} className={`d-flex mb-2 ${chat.sender === auth?.user?._id ? 'justify-content-end' : 'justify-content-start'}`}>
                        <div className={`p-2 rounded ${chat.sender === auth?.user?._id ? 'bg-primary text-white' : 'bg-success text-white'}`} style={{maxWidth: '70%'}}>
                          <p className="mb-1">{chat.textChat}</p>
                          <small className="text-light">
                            {chat.sender === auth?.user?._id ? 'Admin (You)' : selectedEmergency.username} • {chat.createdAt ? new Date(chat.createdAt).toLocaleTimeString() : 'Just now'}
                          </small>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="card-footer">
                  <div className="d-flex">
                    <input 
                      className="form-control me-2"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message..."
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <button className="btn btn-primary" onClick={sendMessage}>Send</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card">
                <div className="card-body text-center">
                  <h5>Select an emergency to start chatting</h5>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminChat;