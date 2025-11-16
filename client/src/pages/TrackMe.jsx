import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaStop, FaCheckCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';
import { useAuth } from '../context/auth';
import '../styles/track-me.css';

const TrackMe = () => {
    const [auth] = useAuth();
    const [isTracking, setIsTracking] = useState(false);
    const [location, setLocation] = useState(null);
    const [intervalId, setIntervalId] = useState(null);

    const getLocation = () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation not supported'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        lat: position.coords.latitude,
                        long: position.coords.longitude
                    });
                },
                (error) => reject(error),
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        });
    };

    const getFormattedAddress = async (lat, long) => {
        return `${lat.toFixed(4)}, ${long.toFixed(4)}`;
    };

    const sendLocationUpdate = async () => {
        try {
            const currentLocation = await getLocation();
            const formatted_address = await getFormattedAddress(currentLocation.lat, currentLocation.long);
            
            setLocation({ ...currentLocation, formatted_address });

            const response = await fetch('http://localhost:5001/api/v1/tracking/update-location', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: auth.user._id,
                    lat: currentLocation.lat,
                    long: currentLocation.long,
                    formatted_address
                })
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log('Location update result:', result);
                toast.success('Location update sent to emergency contacts');
            } else {
                console.error('Server error:', response.status);
                toast.error('Server error: ' + response.status);
            }
        } catch (error) {
            console.error('Error sending location update:', error);
            toast.error('Failed to send location update: ' + error.message);
        }
    };

    const startTracking = async () => {
        try {
            if (!auth?.user?._id) {
                toast.error('Please login first');
                return;
            }

            // Start tracking immediately
            setIsTracking(true);
            localStorage.setItem('isTracking', 'true');
            toast.success('Tracking started!');

            const emergencyContacts = [];
            if (auth.user.emergencyMail) emergencyContacts.push(auth.user.emergencyMail);
            if (auth.user.extraEmail1) emergencyContacts.push(auth.user.extraEmail1);
            if (auth.user.extraEmail2) emergencyContacts.push(auth.user.extraEmail2);
            
            if (emergencyContacts.length === 0) {
                emergencyContacts.push('suraksha7363@gmail.com'); // Fallback for testing
            }
            
            console.log('Final emergency contacts:', emergencyContacts);

            // Start server tracking and send initial email
            fetch('http://localhost:5001/api/v1/tracking/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: auth.user._id,
                    emergencyContacts,
                    username: auth.user.uname
                })
            }).then(async (res) => {
                if (res.ok) {
                    const data = await res.json();
                    console.log('Start tracking response:', data);
                    toast.success('Tracking emails will be sent to emergency contacts');
                    // Send initial location update immediately
                    setTimeout(sendLocationUpdate, 2000);
                } else {
                    const errorText = await res.text();
                    console.error('Server error:', res.status, errorText);
                    toast.error('Server error: ' + res.status);
                }
            }).catch(error => {
                console.error('Network error:', error);
                toast.error('Network error: ' + error.message);
            });

            // Set up interval for every 2 minutes (start after initial email)
            const id = setInterval(sendLocationUpdate, 2 * 60 * 1000);
            setIntervalId(id);
            localStorage.setItem('trackingIntervalId', id);
        } catch (error) {
            console.error('Error starting tracking:', error);
            setIsTracking(false);
            localStorage.setItem('isTracking', 'false');
            toast.error('Failed to start tracking: ' + error.message);
        }
    };

    const stopTracking = () => {
        try {
            // Stop immediately
            if (intervalId) {
                clearInterval(intervalId);
                setIntervalId(null);
            }
            setIsTracking(false);
            localStorage.setItem('isTracking', 'false');
            localStorage.removeItem('trackingIntervalId');
            toast.success('Tracking stopped');

            // Stop server tracking in background
            fetch('http://localhost:5001/api/v1/tracking/stop', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: auth.user._id })
            });
        } catch (error) {
            console.error('Error stopping tracking:', error);
        }
    };

    const confirmSafeArrival = async () => {
        try {
            // Stop tracking immediately
            if (intervalId) {
                clearInterval(intervalId);
                setIntervalId(null);
            }
            setIsTracking(false);
            localStorage.setItem('isTracking', 'false');
            localStorage.removeItem('trackingIntervalId');
            toast.success('Safe arrival confirmed!');

            // Send safe arrival in background
            getLocation().then(async (currentLocation) => {
                const formatted_address = await getFormattedAddress(currentLocation.lat, currentLocation.long);
                
                fetch('http://localhost:5001/api/v1/tracking/safe-arrival', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: auth.user._id,
                        lat: currentLocation.lat,
                        long: currentLocation.long,
                        formatted_address
                    })
                });
            }).catch(() => {
                fetch('http://localhost:5001/api/v1/tracking/stop', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: auth.user._id })
                });
            });
        } catch (error) {
            console.error('Error confirming safe arrival:', error);
        }
    };

    useEffect(() => {
        // Restore tracking state on page load
        const savedTracking = localStorage.getItem('isTracking');
        if (savedTracking === 'true') {
            setIsTracking(true);
            const id = setInterval(sendLocationUpdate, 2 * 60 * 1000);
            setIntervalId(id);
        }
        
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, []);

    return (
        <>
            <Navbar />
            <div className="track-me-container">
                <div className="track-me-header">
                    <FaMapMarkerAlt className="track-icon" />
                    <h1>Track Me Until I Reach</h1>
                    <p>Share your location with trusted contacts during travel</p>
                </div>

                <div className="track-me-content">
                    {!isTracking ? (
                        <div className="start-tracking">
                            <h3>Start Location Tracking</h3>
                            <p>Your location will be shared with emergency contacts every 2 minutes</p>
                            <button onClick={startTracking} className="start-btn">
                                <FaMapMarkerAlt /> Start Tracking
                            </button>
                        </div>
                    ) : (
                        <div className="active-tracking">
                            <h3>🟢 Tracking Active</h3>
                            <p>Location updates are being sent every 2 minutes</p>
                            
                            {location && (
                                <div className="current-location">
                                    <h4>Current Location:</h4>
                                    <p>{location.formatted_address}</p>
                                    <a 
                                        href={`https://maps.google.com/maps?q=${location.lat},${location.long}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="view-map-btn"
                                    >
                                        View on Google Maps
                                    </a>
                                </div>
                            )}

                            <div className="tracking-actions">
                                <button onClick={confirmSafeArrival} className="safe-btn">
                                    <FaCheckCircle /> I'm Safe - Stop Tracking
                                </button>
                                <button onClick={stopTracking} className="stop-btn">
                                    <FaStop /> Stop Tracking
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="track-me-info">
                    <h3>How it works:</h3>
                    <ul>
                        <li>Click "Start Tracking" before you begin your journey</li>
                        <li>Your location will be automatically sent to emergency contacts every 2 minutes</li>
                        <li>Click "I'm Safe" when you reach your destination safely</li>
                        <li>Emergency contacts will receive a confirmation email</li>
                    </ul>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default TrackMe;