import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/auth'
import toast from 'react-hot-toast'
import { FaMicrophone, FaMicrophoneSlash, FaStop } from 'react-icons/fa'
import reports from '../images/report.png'
import Navbar from '../Components/Navbar/Navbar'
import Footer from '../Components/Footer/Footer'
import '../styles/report.css'

const Report = () => {
    const [report, setReport] = useState('')
    const [pincodeOfIncident, setpincodeOfIncident] = useState('')
    const [address, setAddress] = useState('')
    const [files, setFiles] = useState([])
    const [auth, setAuth] = useAuth();
    
    // Speech-to-Text states
    const [isListening, setIsListening] = useState(false)
    const [activeField, setActiveField] = useState(null) // 'report' or 'address'
    const recognitionRef = useRef(null)
    const [speechSupported, setSpeechSupported] = useState(false)
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!report.trim()) {
            toast.error('Report is Required !')
            return false
        }
        if (!pincodeOfIncident.trim()) {
            toast.error('PinCode is Required !')
            return false
        }
        if (!address.trim()) {
            toast.error('Address is Required !')
            return false
        }
        try {
            const formData = new FormData();
            formData.append('user', auth?.user?._id);
            formData.append('report', report);
            formData.append('pincodeOfIncident', pincodeOfIncident);
            formData.append('address', address);
            
            // Append files
            files.forEach((file, index) => {
                formData.append('files', file);
            });

            const res = await axios.post('http://localhost:5001/api/v1/incidents', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (res.status === 201) {
                toast.success('Incident Reported Successfully')
                // Clear form after successful submission
                setReport('')
                setAddress('')
                setpincodeOfIncident('')
                setFiles([])
                // Clear file input
                const fileInput = document.querySelector('input[type="file"]');
                if (fileInput) fileInput.value = '';
            }
        } catch (err) {
            console.error('Report submission error:', err);
            toast.error('Error: ' + (err.response?.data?.message || err.message || 'Failed to submit report'));
        }
    }
    
    // Initialize Speech Recognition
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            setSpeechSupported(true)
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
            recognitionRef.current = new SpeechRecognition()
            
            recognitionRef.current.continuous = false
            recognitionRef.current.interimResults = false
            recognitionRef.current.lang = 'en-US'
            
            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript
                console.log('Speech result:', transcript)
                
                if (activeField === 'report') {
                    setReport(prev => prev + ' ' + transcript)
                } else if (activeField === 'address') {
                    setAddress(prev => prev + ' ' + transcript)
                }
            }
            
            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error)
                toast.error('Speech recognition error. Please try again.')
                setIsListening(false)
            }
            
            recognitionRef.current.onend = () => {
                setIsListening(false)
                console.log('Speech recognition ended')
            }
        }
    }, [activeField])
    
    const startListening = (field) => {
        if (!speechSupported) {
            toast.error('Speech recognition not supported in this browser')
            return
        }
        
        setActiveField(field)
        setIsListening(true)
        
        try {
            recognitionRef.current.start()
            toast.success(`Listening... Speak now!`)
            console.log('Started listening for:', field)
        } catch (error) {
            console.error('Start error:', error)
            setIsListening(false)
        }
    }
    
    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop()
        }
        setIsListening(false)
        setActiveField(null)
        toast('Stopped listening', { icon: 'ℹ️' })
    }
    return (
        <>
            <Navbar />
            <div className='marginStyle '>
                <div class="container d-flex justify-content-center align-items-center">
                    <div class="row border rounded-5 p-3 bg-white shadow box-area reverseCol">
                        <div class="col-md-6 rounded-4 d-flex justify-content-center align-items-center flex-column left-box">
                            <div class="featured-image mb-3 animateImg">
                                <img src={reports} class="img-fluid" />
                            </div>
                        </div>
                        <form method='post' enctype="multipart/form-data" class="col-md-6 right-box">
                            <div class="row align-items-center">
                                <div class="header-text mb-4">
                                    <h2>Report Incident</h2>
                                    <p>Report incidents safely - Type or speak your complaint</p>
                                    {speechSupported && (
                                        <div className="alert alert-info py-2">
                                            <FaMicrophone className="me-2" />
                                            <small>Speech-to-Text enabled! Click the microphone icons to speak instead of typing.</small>
                                        </div>
                                    )}
                                </div>
                                <div class="input-group d-flex  align-items-center mb-3">
                                    <div class="form-outline flex-fill mb-0">
                                    </div>
                                </div>
                                <div class="input-group d-flex flex-row align-items-center mb-3">
                                    <div class="input-group d-flex flex-row align-items-center mb-3">
                                        <div class="form-outline flex-fill mb-0">
                                            <input type="number" value={pincodeOfIncident} onChange={(e) => setpincodeOfIncident(e.target.value)} class="form-control form-control-lg border-dark fs-6" placeholder="Enter the PinCode of the Incident" required />
                                        </div>
                                    </div>
                                    <div class="input-group d-flex flex-row align-items-center mb-3">
                                        <div class="form-outline flex-fill mb-0 position-relative">
                                            <textarea 
                                                type="text" 
                                                rows={4} 
                                                value={report} 
                                                onChange={(e) => setReport(e.target.value)} 
                                                class="form-control form-control-lg border-dark fs-6" 
                                                placeholder="Write the Report of the Incident or click the microphone to speak" 
                                                required 
                                            />
                                            <div className="speech-controls position-absolute" style={{top: '10px', right: '10px'}}>
                                                {speechSupported && (
                                                    <>
                                                        {!isListening || activeField !== 'report' ? (
                                                            <button 
                                                                type="button" 
                                                                className="btn btn-sm btn-outline-primary me-2"
                                                                onClick={() => startListening('report')}
                                                                title="Start voice input for report"
                                                            >
                                                                <FaMicrophone />
                                                            </button>
                                                        ) : (
                                                            <button 
                                                                type="button" 
                                                                className="btn btn-sm btn-danger me-2"
                                                                onClick={stopListening}
                                                                title="Stop voice input"
                                                            >
                                                                <FaStop /> Listening...
                                                            </button>
                                                        )}
                                                        <button 
                                                            type="button" 
                                                            className="btn btn-sm btn-outline-secondary"
                                                            onClick={() => setReport('')}
                                                            title="Clear text"
                                                        >
                                                            Clear
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="input-group d-flex flex-row align-items-center mb-3">
                                        <div class="form-outline flex-fill mb-0 position-relative">
                                            <textarea 
                                                rows={3} 
                                                type="text" 
                                                value={address} 
                                                onChange={(e) => setAddress(e.target.value)} 
                                                class="form-control form-control-lg border-dark fs-6" 
                                                placeholder="Enter the Address of the Incident or click the microphone to speak" 
                                                required 
                                            />
                                            <div className="speech-controls position-absolute" style={{top: '10px', right: '10px'}}>
                                                {speechSupported && (
                                                    <>
                                                        {!isListening || activeField !== 'address' ? (
                                                            <button 
                                                                type="button" 
                                                                className="btn btn-sm btn-outline-primary me-2"
                                                                onClick={() => startListening('address')}
                                                                title="Start voice input for address"
                                                            >
                                                                <FaMicrophone />
                                                            </button>
                                                        ) : (
                                                            <button 
                                                                type="button" 
                                                                className="btn btn-sm btn-danger me-2"
                                                                onClick={stopListening}
                                                                title="Stop voice input"
                                                            >
                                                                <FaStop /> Listening...
                                                            </button>
                                                        )}
                                                        <button 
                                                            type="button" 
                                                            className="btn btn-sm btn-outline-secondary"
                                                            onClick={() => setAddress('')}
                                                            title="Clear text"
                                                        >
                                                            Clear
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* File Upload Section */}
                                    <div class="input-group d-flex flex-row align-items-center mb-3">
                                        <div class="form-outline flex-fill mb-0">
                                            <label className="form-label fw-bold">📎 Upload Evidence (Images/Videos)</label>
                                            <input 
                                                type="file" 
                                                className="form-control form-control-lg border-dark" 
                                                multiple
                                                accept="image/*,video/*"
                                                onChange={(e) => setFiles(Array.from(e.target.files))}
                                            />
                                            <small className="text-muted">You can upload multiple images and videos as evidence</small>
                                            {files.length > 0 && (
                                                <div className="mt-2">
                                                    <strong>Selected files:</strong>
                                                    <ul className="list-unstyled mt-1">
                                                        {files.map((file, index) => (
                                                            <li key={index} className="text-success">
                                                                📄 {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                

                                
                                <div class="d-flex flex-row align-items-center my-3 ">
                                    <div class="form-outline flex-fill mb-0 " >
                                        <button className='btn text-white btn-lg btn-block' onClick={handleSubmit} style={{ width: '100%', backgroundColor: 'blueviolet' }} type="submit">Submit Incident</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div >
            </div>
            <Footer />
        </>
    )
}

export default Report