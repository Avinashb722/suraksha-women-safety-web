import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/auth';
import toast from 'react-hot-toast';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';

const EmergencyContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relation: '' });
  const [auth] = useAuth();

  useEffect(() => {
    // Load contacts from localStorage
    const saved = localStorage.getItem('emergencyContacts');
    if (saved) {
      setContacts(JSON.parse(saved));
    }
  }, []);

  const saveContacts = (updatedContacts) => {
    setContacts(updatedContacts);
    localStorage.setItem('emergencyContacts', JSON.stringify(updatedContacts));
  };

  const addContact = () => {
    if (!newContact.name || !newContact.phone) {
      toast.error('Name and phone are required');
      return;
    }

    const contact = {
      id: Date.now(),
      ...newContact
    };

    const updated = [...contacts, contact];
    saveContacts(updated);
    setNewContact({ name: '', phone: '', relation: '' });
    toast.success('Contact added successfully');
  };

  const removeContact = (id) => {
    const updated = contacts.filter(c => c.id !== id);
    saveContacts(updated);
    toast.success('Contact removed');
  };

  const callContact = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const sendSMS = (phone) => {
    const message = "I need help! This is an emergency. Please check on me.";
    window.location.href = `sms:${phone}?body=${encodeURIComponent(message)}`;
  };

  return (
    <>
      <Navbar />
      <div style={{minHeight: '100vh', paddingTop: '100px', paddingBottom: '20px'}}>
        <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
            <div className="card-body text-white p-4">
              <h2 className="text-center mb-4">👥 Emergency Contacts</h2>
              
              <div className="row mb-3">
                <div className="col-md-4">
                  <input 
                    type="text"
                    className="form-control"
                    placeholder="Name"
                    value={newContact.name}
                    onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                  />
                </div>
                <div className="col-md-4">
                  <input 
                    type="tel"
                    className="form-control"
                    placeholder="Phone"
                    value={newContact.phone}
                    onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                  />
                </div>
                <div className="col-md-4">
                  <select 
                    className="form-select"
                    value={newContact.relation}
                    onChange={(e) => setNewContact({...newContact, relation: e.target.value})}
                  >
                    <option value="">Relation</option>
                    <option value="Family">Family</option>
                    <option value="Friend">Friend</option>
                    <option value="Colleague">Colleague</option>
                    <option value="Neighbor">Neighbor</option>
                  </select>
                </div>
              </div>
              
              <div className="text-center mb-4">
                <button className="btn btn-light" onClick={addContact}>
                  ➕ Add Contact
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4">
            {contacts.length === 0 ? (
              <div className="text-center text-muted">
                <p>No emergency contacts added yet</p>
              </div>
            ) : (
              contacts.map(contact => (
                <div key={contact.id} className="card mb-3 shadow">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="mb-1">{contact.name}</h5>
                        <p className="text-muted mb-1">{contact.phone}</p>
                        {contact.relation && (
                          <span className="badge bg-primary">{contact.relation}</span>
                        )}
                      </div>
                      <div>
                        <button 
                          className="btn btn-success btn-sm me-2"
                          onClick={() => callContact(contact.phone)}
                        >
                          📞 Call
                        </button>
                        <button 
                          className="btn btn-info btn-sm me-2"
                          onClick={() => sendSMS(contact.phone)}
                        >
                          💬 SMS
                        </button>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => removeContact(contact.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
        </div>
      </div>
    <Footer />
    </>
  );
};

export default EmergencyContacts;