import React, { useState, useEffect, useRef } from 'react';
import { FaMicrophone, FaStop, FaTimes, FaRobot, FaPaperPlane } from 'react-icons/fa';
import { useAuth } from '../context/auth';
import { triggerEmergency } from '../utils/emergencyUtils';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [textInput, setTextInput] = useState('');
  const [hotwordActive, setHotwordActive] = useState(false);
  const hotwordRecognitionRef = useRef(null);
  const [auth] = useAuth();

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
      setResponse('');
      console.log('Voice input started');
    };
    
    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      console.log('Voice input received:', speechResult);
      setTranscript(speechResult);
      handleQuery(speechResult);
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };
    
    recognition.onend = () => {
      console.log('Speech recognition ended');
      setIsListening(false);
    };
    
    recognition.start();
  };

  const stopListening = () => {
    setIsListening(false);
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  };

  const handleTextQuery = async () => {
    if (!textInput.trim()) return;
    const query = textInput;
    setTextInput('');
    await handleQuery(query);
  };

  // Play confirmation sound when hotword detected
  const playConfirmationSound = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance('Yes?');
      utterance.rate = 1.2;
      utterance.pitch = 1.1;
      utterance.volume = 0.7;
      speechSynthesis.speak(utterance);
    }
  };

  const handleQuery = async (query) => {
    setResponse('Thinking...');
    
    // Check for emergency keywords first
    const lowerQuery = query.toLowerCase();
    const emergencyKeywords = ['help', 'emergency', 'send mail', 'sos', 'danger', 'attack', 'assault', 'violence', 'hurt', 'save me', 'call police'];
    
    const isEmergency = emergencyKeywords.some(keyword => lowerQuery.includes(keyword));
    
    if (isEmergency) {
      setResponse('🚨 TRIGGERING EMERGENCY SOS...');
      const success = await triggerEmergency(auth);
      if (success) {
        const emergencyResponse = '🚨 EMERGENCY SOS ACTIVATED! Location shared with contacts and authorities. Stay safe!';
        setResponse(emergencyResponse);
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance('Emergency SOS activated! Help is on the way!');
          utterance.rate = 1.2;
          utterance.pitch = 1.1;
          speechSynthesis.speak(utterance);
        }
        return;
      }
    }
    
    // Fast fallback responses for common queries
    let fastResponse = '';

    if (lowerQuery.includes('attack') || lowerQuery.includes('assault') || lowerQuery.includes('danger') || lowerQuery.includes('hitting') || lowerQuery.includes('violence') || lowerQuery.includes('hurt')) {
      fastResponse = '🚨 IMMEDIATE: Get to public area, scream for help. Call 100 (Police) or 181 (Women Helpline). Use Suraksha emergency button.';
    } else if (lowerQuery.includes('safety tips')) {
      fastResponse = '🛡️ Stay alert, trust instincts. Share live location with family. Avoid isolated areas at night.';
    } else if (lowerQuery.includes('report') || lowerQuery.includes('incident')) {
      fastResponse = '📝 Use Report Incident page. Upload photos/videos as evidence. Include detailed description and location.';
    } else if (lowerQuery.includes('chat') || lowerQuery.includes('support')) {
      fastResponse = '💬 Emergency chat activates after SOS trigger. Real-time support available 24/7 during emergencies.';
    }

    if (fastResponse) {
      setResponse(fastResponse);
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(fastResponse);
        utterance.rate = 1.0;
        speechSynthesis.speak(utterance);
      }
      return;
    }
    
    // Try API with timeout for other queries
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
      
      const response = await fetch('http://localhost:5001/api/v1/chatbot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        let aiResponse = data.response || 'I\'m here to help!';
        if (aiResponse.length > 200) {
          aiResponse = aiResponse.substring(0, 200) + '...';
        }
        setResponse(aiResponse);
        
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(aiResponse);
          utterance.rate = 1.0;
          speechSynthesis.speak(utterance);
        }
      } else {
        throw new Error('API failed');
      }
    } catch (error) {
      const fallback = '🤖 I help with safety advice and emergency procedures. Try "emergency help" or "safety tips".';
      setResponse(fallback);
      
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(fallback);
        utterance.rate = 1.0;
        speechSynthesis.speak(utterance);
      }
    }
  };

  // Chrome-compatible Hotword Detection
  const startHotwordDetection = async () => {
    if (isOpen || !('webkitSpeechRecognition' in window)) return;
    
    try {
      // Stop any existing recognition
      if (hotwordRecognitionRef.current) {
        hotwordRecognitionRef.current.stop();
      }
      
      setHotwordActive(true);
      
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;
      
      recognition.onstart = () => {
        console.log('Hotword detection active - say "Suraksha" or "Nova"');
      };
      
      recognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript.toLowerCase().trim();
          console.log('Heard:', transcript);
          
          // Check for emergency keywords first
          const emergencyKeywords = ['help', 'emergency', 'send mail', 'sos', 'danger', 'save me'];
          const isEmergencyCall = emergencyKeywords.some(keyword => transcript.includes(keyword));
          
          if (isEmergencyCall && !isOpen) {
            console.log('🚨 Emergency keyword detected:', transcript);
            
            // Trigger emergency in background immediately
            triggerEmergency(auth).then(success => {
              if (success && 'speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance('Emergency SOS sent');
                speechSynthesis.speak(utterance);
              }
            });
            
            // Continue hotword detection without stopping
            break;
          }
          
          if ((transcript.includes('suraksha') || transcript.includes('nova') || transcript.includes('nexa') ||
               transcript.includes('surakhsa') || transcript.includes('nowa') || transcript.includes('nexha') ||
               transcript.includes('surakha') || transcript.includes('neva') || transcript.includes('neksa')) && !isOpen) {
            console.log('✅ Hotword detected:', transcript);
            setIsOpen(true);
            stopHotwordDetection();
            
            // Play confirmation sound and start listening
            setTimeout(() => {
              playConfirmationSound();
              setTimeout(() => {
                startListening();
              }, 500);
            }, 300);
            break;
          }
        }
      };
      
      recognition.onerror = (event) => {
        console.log('Hotword error:', event.error);
        setHotwordActive(false);
        if (event.error !== 'aborted' && !isOpen) {
          setTimeout(() => {
            if (!isOpen) startHotwordDetection();
          }, 2000);
        }
      };
      
      recognition.onend = () => {
        console.log('Hotword detection ended');
        setHotwordActive(false);
        if (!isOpen) {
          setTimeout(() => {
            if (!isOpen) {
              console.log('Restarting hotword detection');
              startHotwordDetection();
            }
          }, 1000);
        }
      };
      
      hotwordRecognitionRef.current = recognition;
      recognition.start();
      
    } catch (error) {
      console.error('Hotword setup failed:', error);
      setHotwordActive(false);
      setTimeout(() => {
        if (!isOpen) startHotwordDetection();
      }, 3000);
    }
  };
  
  const stopHotwordDetection = () => {
    if (hotwordRecognitionRef.current && hotwordActive) {
      try {
        hotwordRecognitionRef.current.stop();
      } catch (error) {
        console.log('Stop hotword error:', error);
      }
    }
    setHotwordActive(false);
  };
  
  // Initialize hotword detection on component mount
  useEffect(() => {
    // Request microphone permission first
    const initHotword = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log('Microphone permission granted');
        setTimeout(() => {
          if (!isOpen) {
            console.log('Starting initial hotword detection');
            startHotwordDetection();
          }
        }, 1000);
      } catch (error) {
        console.log('Microphone permission denied:', error);
      }
    };
    
    initHotword();
    
    return () => {
      stopHotwordDetection();
    };
  }, []);

  return (
    <>
      {/* Floating AI Button */}
      <div 
        className={`position-fixed ${isOpen ? 'd-none' : 'd-flex'}`}
        style={{
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          backgroundColor: '#667eea',
          borderRadius: '50%',
          cursor: 'pointer',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          zIndex: 1000,
          transition: 'all 0.3s ease'
        }}
        onClick={() => {
          setIsOpen(true);
          stopHotwordDetection();
        }}
      >
        <FaRobot size={24} color="white" />
      </div>

      {/* AI Assistant Modal */}
      {isOpen && (
        <div 
          className="position-fixed"
          style={{
            bottom: '20px',
            right: '20px',
            width: '350px',
            backgroundColor: 'white',
            borderRadius: '15px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
            zIndex: 1001,
            border: '1px solid #e0e0e0',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div 
            className="d-flex justify-content-between align-items-center p-3"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}
          >
            <div className="d-flex align-items-center">
              <FaRobot className="me-2" size={18} />
              <span className="fw-bold small">Suraksha AI</span>
            </div>
            <FaTimes 
              size={16}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setIsOpen(false);
                stopListening();
                setTextInput('');
                setTranscript('');
                setResponse('');
                setTimeout(() => startHotwordDetection(), 500);
              }}
            />
          </div>

          {/* Response Area */}
          <div className="p-3" style={{ minHeight: '280px', maxHeight: '320px', overflowY: 'auto' }}>
            {transcript && (
              <div className="mb-2 p-2 bg-light rounded">
                <small className="text-muted">You said:</small>
                <div className="fw-medium small">{transcript}</div>
              </div>
            )}
            
            {!response ? (
              <div className="text-center text-muted small">
                Ask me about safety, emergencies, or app features
              </div>
            ) : (
              <div className="small" style={{ 
                backgroundColor: response === 'Thinking...' ? '#fff3cd' : '#f8f9ff', 
                padding: '8px', 
                borderRadius: '8px',
                border: '1px solid #e0e6ff'
              }}>
                {response}
              </div>
            )}
          </div>

          {/* Voice Controls */}
          <div className="px-3 py-2 border-top d-flex justify-content-center align-items-center">
            {!isListening ? (
              <button 
                className="btn btn-primary rounded-circle me-2"
                style={{ width: '35px', height: '35px', padding: 0 }}
                onClick={startListening}
              >
                <FaMicrophone size={14} />
              </button>
            ) : (
              <button 
                className="btn btn-danger rounded-circle me-2"
                style={{ width: '35px', height: '35px', padding: 0 }}
                onClick={stopListening}
              >
                <FaStop size={14} />
              </button>
            )}
            <small className="text-muted">
              {isListening ? 'Listening...' : 'Voice'}
            </small>
          </div>
          
          {/* Text Input */}
          <div className="p-3 pt-0">
            <div className="input-group input-group-sm">
              <input 
                type="text"
                className="form-control"
                placeholder="Type here..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTextQuery()}
                style={{ fontSize: '12px' }}
              />
              <button 
                className="btn btn-primary"
                onClick={handleTextQuery}
                disabled={!textInput.trim()}
                style={{ padding: '4px 8px' }}
              >
                <FaPaperPlane size={12} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;