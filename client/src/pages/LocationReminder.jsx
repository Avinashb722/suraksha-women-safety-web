import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaExclamationTriangle, FaShieldAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';
import '../styles/location-reminder.css';

const LocationReminder = () => {
    const [currentLocation, setCurrentLocation] = useState(null);
    const [isMonitoring, setIsMonitoring] = useState(false);
    const [watchId, setWatchId] = useState(null);

    // User-reported unsafe zones only
    const [unsafeZones, setUnsafeZones] = useState([]);
    const [showReportForm, setShowReportForm] = useState(false);
    const [newZoneData, setNewZoneData] = useState({ 
        name: '', 
        type: 'dark_street', 
        description: '',
        useCurrentLocation: true,
        manualLat: '',
        manualLng: ''
    });

    const calculateDistance = (lat1, lng1, lat2, lng2) => {
        const R = 6371e3; // Earth's radius in meters
        const φ1 = lat1 * Math.PI/180;
        const φ2 = lat2 * Math.PI/180;
        const Δφ = (lat2-lat1) * Math.PI/180;
        const Δλ = (lng2-lng1) * Math.PI/180;

        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return R * c; // Distance in meters
    };

    const checkUnsafeZones = (lat, lng) => {
        unsafeZones.forEach(zone => {
            const distance = calculateDistance(lat, lng, zone.lat, zone.lng);
            if (distance <= zone.radius) {
                showUnsafeZoneWarning(zone);
            }
        });
    };

    const showUnsafeZoneWarning = (zone) => {
        const warnings = {
            dark_street: 'You are in a dark street area. Stay alert and consider taking a well-lit route.',
            bus_stop: 'This bus stop area may be unsafe. Stay in well-lit areas and be aware of surroundings.',
            alley: 'You are near an unsafe alley. Avoid isolated areas and stay on main roads.',
            poorly_lit: 'This area is poorly lit. Consider using a flashlight and stay alert.',
            park: 'This park area may be deserted. Avoid isolated areas, especially after dark.'
        };

        toast.error(`⚠️ UNSAFE ZONE: ${zone.name}\n${warnings[zone.type]}`, {
            duration: 8000,
            style: {
                background: '#ff4444',
                color: 'white',
                fontWeight: 'bold'
            }
        });

        // Show popup warning
        if (window.confirm(`⚠️ UNSAFE ZONE ALERT!\n\n${zone.name}\n\n${warnings[zone.type]}\n\nWould you like to see safety tips?`)) {
            showSafetyTips();
        }
    };

    const showSafetyTips = () => {
        alert(`🛡️ SAFETY TIPS:\n\n• Stay in well-lit, populated areas\n• Keep emergency contacts ready\n• Trust your instincts\n• Avoid wearing headphones\n• Walk confidently\n• Have emergency numbers ready: 100, 181, 1091`);
    };

    const startMonitoring = () => {
        if (!navigator.geolocation) {
            toast.error('Geolocation not supported by this browser');
            return;
        }

        const id = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setCurrentLocation({ lat: latitude, lng: longitude });
                checkUnsafeZones(latitude, longitude);
            },
            (error) => {
                console.error('Location error:', error);
                toast.error('Unable to get location. Please enable location services.');
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
        );

        setWatchId(id);
        setIsMonitoring(true);
        toast.success('Location monitoring started. You will be warned about unsafe zones.');
    };

    const stopMonitoring = () => {
        if (watchId) {
            navigator.geolocation.clearWatch(watchId);
            setWatchId(null);
        }
        setIsMonitoring(false);
        toast.success('Location monitoring stopped');
    };

    const reportUnsafeZone = async () => {
        if (!newZoneData.name || !newZoneData.description) {
            toast.error('Please fill in all fields');
            return;
        }
        
        let lat, lng;
        
        if (newZoneData.useCurrentLocation) {
            if (!currentLocation) {
                toast.error('Please enable location monitoring first');
                return;
            }
            lat = currentLocation.lat;
            lng = currentLocation.lng;
        } else {
            if (!newZoneData.manualLat || !newZoneData.manualLng) {
                toast.error('Please enter latitude and longitude');
                return;
            }
            lat = parseFloat(newZoneData.manualLat);
            lng = parseFloat(newZoneData.manualLng);
            
            if (isNaN(lat) || isNaN(lng)) {
                toast.error('Please enter valid coordinates');
                return;
            }
        }
        
        const newZone = {
            id: Date.now(),
            name: newZoneData.name,
            lat: lat,
            lng: lng,
            radius: 100,
            type: newZoneData.type,
            reports: 1,
            description: newZoneData.description,
            reportedBy: 'current_user',
            reportedAt: new Date().toISOString()
        };
        
        setUnsafeZones([...unsafeZones, newZone]);
        setShowReportForm(false);
        setNewZoneData({ 
            name: '', 
            type: 'dark_street', 
            description: '',
            useCurrentLocation: true,
            manualLat: '',
            manualLng: ''
        });
        
        toast.success('Unsafe zone reported successfully! Thank you for helping the community.');
        
        // Save to localStorage for persistence
        const savedZones = JSON.parse(localStorage.getItem('userReportedZones') || '[]');
        savedZones.push(newZone);
        localStorage.setItem('userReportedZones', JSON.stringify(savedZones));
        
        console.log('New unsafe zone reported:', newZone);
    };
    
    const deleteUnsafeZone = (zoneId) => {
        if (window.confirm('Are you sure you want to delete this unsafe zone?')) {
            const updatedZones = unsafeZones.filter(zone => zone.id !== zoneId);
            setUnsafeZones(updatedZones);
            localStorage.setItem('userReportedZones', JSON.stringify(updatedZones));
            toast.success('Unsafe zone deleted successfully');
        }
    };
    
    const addMultipleZones = () => {
        if (!newZoneData.name || !newZoneData.description) {
            toast.error('Please fill in all fields first');
            return;
        }
        
        // Add current zone
        reportUnsafeZone();
        
        // Keep form open for next zone
        setTimeout(() => {
            setShowReportForm(true);
            setNewZoneData({ 
                name: '', 
                type: newZoneData.type, // Keep same type
                description: '',
                useCurrentLocation: newZoneData.useCurrentLocation, // Keep location preference
                manualLat: '',
                manualLng: ''
            });
            toast.info('Add another unsafe zone');
        }, 500);
    };
    
    const clearAllZones = () => {
        if (window.confirm('Are you sure you want to delete ALL unsafe zones? This cannot be undone.')) {
            setUnsafeZones([]);
            localStorage.removeItem('userReportedZones');
            toast.success('All unsafe zones cleared');
        }
    };
    
    // Load saved zones on component mount
    useEffect(() => {
        const savedZones = JSON.parse(localStorage.getItem('userReportedZones') || '[]');
        setUnsafeZones(savedZones);
    }, []);
    
    useEffect(() => {
        return () => {
            if (watchId) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, [watchId]);

    return (
        <>
            <Navbar />
            <div className="location-reminder-container">
                <div className="location-header">
                    <div className="icon-container">
                        <FaShieldAlt className="shield-icon" />
                        <div className="icon-glow"></div>
                    </div>
                    <h1>Safety Zone Monitor</h1>
                    <p>Smart location alerts for your protection</p>
                    <div className="header-stats">
                        <div className="stat-item">
                            <span className="stat-number">{unsafeZones.length}</span>
                            <span className="stat-label">Zones Tracked</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">{isMonitoring ? '🟢' : '🔴'}</span>
                            <span className="stat-label">{isMonitoring ? 'Active' : 'Inactive'}</span>
                        </div>
                    </div>
                </div>

                <div className="monitoring-section">
                    {!isMonitoring ? (
                        <div className="start-monitoring">
                            <div className="monitoring-icon">
                                <FaMapMarkerAlt className="location-pulse" />
                            </div>
                            <h3>Activate Safety Shield</h3>
                            <p>Enable real-time location monitoring to receive instant alerts when entering unsafe zones</p>
                            <div className="features-preview">
                                <div className="feature-item">
                                    <span className="feature-icon">⚡</span>
                                    <span>Instant Alerts</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-icon">📍</span>
                                    <span>GPS Tracking</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-icon">🔔</span>
                                    <span>Smart Notifications</span>
                                </div>
                            </div>
                            <button onClick={startMonitoring} className="start-monitor-btn">
                                <FaMapMarkerAlt /> Activate Protection
                            </button>
                        </div>
                    ) : (
                        <div className="active-monitoring">
                            <div className="status-indicator">
                                <div className="pulse-ring"></div>
                                <div className="pulse-dot"></div>
                            </div>
                            <h3>Protection Active</h3>
                            <p>Your safety shield is monitoring your location</p>
                            
                            {currentLocation && (
                                <div className="current-location">
                                    <div className="location-header">
                                        <FaMapMarkerAlt className="location-icon" />
                                        <h4>Current Position</h4>
                                    </div>
                                    <div className="coordinates">
                                        <span className="coord-label">LAT:</span>
                                        <span className="coord-value">{currentLocation.lat.toFixed(6)}</span>
                                        <span className="coord-label">LNG:</span>
                                        <span className="coord-value">{currentLocation.lng.toFixed(6)}</span>
                                    </div>
                                    <div className="location-status">
                                        <span className="status-dot"></span>
                                        <span>Location tracking active</span>
                                    </div>
                                </div>
                            )}

                            <button onClick={stopMonitoring} className="stop-monitor-btn">
                                <FaExclamationTriangle /> Deactivate Shield
                            </button>
                        </div>
                    )}
                </div>

                <div className="unsafe-zones-list">
                    <div className="zones-header">
                        <h3>My Unsafe Zones ({unsafeZones.length})</h3>
                        <div className="header-buttons">
                            <button onClick={() => setShowReportForm(true)} className="report-zone-btn">
                                ➕ Add Zone
                            </button>
                            <button onClick={clearAllZones} className="clear-all-btn">
                                🗑️ Clear All
                            </button>
                        </div>
                    </div>
                    
                    {showReportForm && (
                        <div className="report-form">
                            <h4>Report New Unsafe Zone</h4>
                            <input 
                                type="text" 
                                placeholder="Zone name (e.g., Dark alley near XYZ)"
                                value={newZoneData.name}
                                onChange={(e) => setNewZoneData({...newZoneData, name: e.target.value})}
                            />
                            <select 
                                value={newZoneData.type}
                                onChange={(e) => setNewZoneData({...newZoneData, type: e.target.value})}
                            >
                                <option value="dark_street">Dark Street</option>
                                <option value="poorly_lit">Poorly Lit Area</option>
                                <option value="alley">Unsafe Alley</option>
                                <option value="bus_stop">Isolated Bus Stop</option>
                                <option value="park">Deserted Park/Area</option>
                                <option value="other">Other</option>
                            </select>
                            <textarea 
                                placeholder="Describe why this area is unsafe..."
                                value={newZoneData.description}
                                onChange={(e) => setNewZoneData({...newZoneData, description: e.target.value})}
                            />
                            
                            <div className="location-options">
                                <label>
                                    <input 
                                        type="radio" 
                                        checked={newZoneData.useCurrentLocation}
                                        onChange={() => setNewZoneData({...newZoneData, useCurrentLocation: true})}
                                    />
                                    Use Current Location
                                </label>
                                <label>
                                    <input 
                                        type="radio" 
                                        checked={!newZoneData.useCurrentLocation}
                                        onChange={() => setNewZoneData({...newZoneData, useCurrentLocation: false})}
                                    />
                                    Enter Location Manually
                                </label>
                            </div>
                            
                            {!newZoneData.useCurrentLocation && (
                                <div className="manual-location">
                                    <input 
                                        type="number" 
                                        step="any"
                                        placeholder="Latitude (e.g., 12.9716)"
                                        value={newZoneData.manualLat}
                                        onChange={(e) => setNewZoneData({...newZoneData, manualLat: e.target.value})}
                                    />
                                    <input 
                                        type="number" 
                                        step="any"
                                        placeholder="Longitude (e.g., 77.5946)"
                                        value={newZoneData.manualLng}
                                        onChange={(e) => setNewZoneData({...newZoneData, manualLng: e.target.value})}
                                    />
                                </div>
                            )}
                            <div className="form-buttons">
                                <button onClick={reportUnsafeZone} className="submit-report-btn">Add Unsafe Zone</button>
                                <button onClick={addMultipleZones} className="add-multiple-btn">Add Multiple Zones</button>
                                <button onClick={() => setShowReportForm(false)} className="cancel-btn">Cancel</button>
                            </div>
                        </div>
                    )}
                    
                    <div className="zones-grid">
                        {unsafeZones.map((zone) => (
                            <div key={zone.id} className="zone-card">
                                <div className="zone-header">
                                    <FaExclamationTriangle className="warning-icon" />
                                    <h4>{zone.name}</h4>
                                    <button 
                                        onClick={() => deleteUnsafeZone(zone.id)} 
                                        className="delete-zone-btn"
                                        title="Delete this zone"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <p>Type: {zone.type.replace('_', ' ')}</p>
                                <p>Reports: {zone.reports} users</p>
                                <p>Radius: {zone.radius}m</p>
                                <p>Reported by: Community users</p>
                                <p>Location: {zone.lat.toFixed(4)}, {zone.lng.toFixed(4)}</p>
                                <p>Added: {new Date(zone.reportedAt).toLocaleDateString()}</p>
                            </div>
                        ))}
                        
                        {unsafeZones.length === 0 && (
                            <div className="no-zones">
                                <p>No unsafe zones reported yet. Be the first to report one!</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="data-sources">
                    <h3>Community-Driven Safety Reporting</h3>
                    <div className="sources-grid">
                        <div className="source-card">
                            <h4>👥 User Reports</h4>
                            <p>Community members report unsafe areas based on personal experiences</p>
                        </div>
                        <div className="source-card">
                            <h4>📍 Current Location</h4>
                            <p>Report unsafe zones at your current GPS location instantly</p>
                        </div>
                        <div className="source-card">
                            <h4>🗺️ Manual Location</h4>
                            <p>Enter coordinates manually to report areas you know are unsafe</p>
                        </div>
                        <div className="source-card">
                            <h4>🔄 Real-time Updates</h4>
                            <p>Get warnings as soon as community members report new unsafe areas</p>
                        </div>
                    </div>
                </div>
                
                <div className="safety-info">
                    <h3>How to manage zones:</h3>
                    <ul>
                        <li>Click "Add Zone" to report a single unsafe area</li>
                        <li>Use "Add Multiple Zones" to quickly add several areas</li>
                        <li>Click ✕ on any zone card to delete it</li>
                        <li>Use "Clear All" to remove all zones at once</li>
                        <li>All zones are saved locally on your device</li>
                    </ul>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default LocationReminder;