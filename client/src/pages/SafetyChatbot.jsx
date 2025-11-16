import React, { useState } from 'react';
import { FaPaperPlane, FaRobot, FaUser } from 'react-icons/fa';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';
import '../styles/safety-chatbot.css';

const SafetyChatbot = () => {
    const [messages, setMessages] = useState([
        { text: "Hi! I'm your AI assistant. Ask me anything you'd like to know - I'm here to help!", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');



    const getResponse = async (message) => {
        try {
            const response = await fetch('http://localhost:5001/api/v1/chatbot/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });
            
            if (!response.ok) throw new Error('API failed');
            
            const data = await response.json();
            return data.response || 'I\'m here to help with any question you have!';
        } catch (error) {
            console.error('API Error:', error);
            return 'I\'m currently unable to connect to my AI service. Please restart the server or check your internet connection and try again.';
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;
        
        const userMessage = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        
        const currentInput = input;
        setInput('');
        
        const botResponseText = await getResponse(currentInput);
        const botResponse = { text: botResponseText, sender: 'bot' };
        
        setMessages(prev => [...prev, botResponse]);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            <Navbar />
            <div className="chatbot-container">
                <div className="chat-header">
                    <FaRobot className="bot-icon" />
                    <h2>AI Assistant</h2>
                    <p>Ask me anything - I'm here to help!</p>
                </div>

                <div className="chat-messages">
                    {messages.map((message, index) => (
                        <div key={index} className={`message ${message.sender}`}>
                            <div className="message-icon">
                                {message.sender === 'bot' ? <FaRobot /> : <FaUser />}
                            </div>
                            <div className="message-content">
                                {message.text}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="chat-input">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask me anything you'd like to know..."
                        rows="2"
                    />
                    <button onClick={handleSend} disabled={!input.trim()}>
                        <FaPaperPlane />
                    </button>
                </div>

                <div className="quick-questions">
                    <h4>Popular Topics:</h4>
                    <div className="question-buttons">
                        {['Hello', 'Help', 'Safety Tips', 'Health', 'Technology', 'Education', 'Travel', 'Food'].map((q) => (
                            <button key={q} onClick={() => setInput(q)} className="quick-btn">
                                {q}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default SafetyChatbot;