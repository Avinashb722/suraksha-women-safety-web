import React, { useState } from 'react';
import toast from 'react-hot-toast';

const LocationTest = () => {
  const [location, setLocation] = useState(null);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('GPS not supported on this device');
      return;
    }

    toast.loading('Getting GPS location...');
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        const accuracy = position.coords.accuracy;
        setLocation({ lat, long });
        toast.dismiss();
        toast.success(`GPS: ${lat.toFixed(4)}, ${long.toFixed(4)} (±${Math.round(accuracy)}m)`);
      },
      (error) => {
        toast.dismiss();
        let errorMsg = 'GPS failed: ';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMsg += 'Permission denied. Enable location in browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg += 'Location unavailable. Try outdoors.';
            break;
          case error.TIMEOUT:
            errorMsg += 'Timeout. Try again.';
            break;
          default:
            errorMsg += 'Unknown error. Use manual selection.';
        }
        toast.error(errorMsg);
      },
      { 
        enableHighAccuracy: true, 
        timeout: 15000, 
        maximumAge: 0 
      }
    );
  };

  const selectLocation = (city) => {
    const cities = {
      'belagavi': { lat: 15.8497, long: 74.4977, name: 'Belagavi, Karnataka' },
      'bengaluru': { lat: 12.9716, long: 77.5946, name: 'Bengaluru, Karnataka' },
      'mumbai': { lat: 19.0760, long: 72.8777, name: 'Mumbai, Maharashtra' }
    };
    
    if (cities[city]) {
      const loc = cities[city];
      setLocation({ lat: loc.lat, long: loc.long });
      toast.success(`Location set to: ${loc.name}`);
    }
  };

  const testEmergency = async () => {
    if (!location) {
      toast.error('Get location first');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/v1/emergency/emergencyPressed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: '507f1f77bcf86cd799439011', // dummy user ID
          lat: location.lat,
          long: location.long
        })
      });

      if (response.ok) {
        toast.success('Emergency sent with your real location!');
      } else {
        toast.error('Emergency failed');
      }
    } catch (error) {
      toast.error('Error sending emergency');
    }
  };

  const testBelagaviLocation = async () => {
    // Manual Belagavi coordinates
    const belagaviLat = 15.8497;
    const belagaviLong = 74.4977;

    try {
      const response = await fetch('http://localhost:5001/api/v1/emergency/emergencyPressed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: '507f1f77bcf86cd799439011',
          lat: belagaviLat,
          long: belagaviLong
        })
      });

      if (response.ok) {
        toast.success('Emergency sent with your real location!');
      } else {
        toast.error('Emergency failed');
      }
    } catch (error) {
      toast.error('Error sending emergency');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Location Test</h2>
      <div style={{marginBottom: '20px'}}>
        <h3>GPS Location:</h3>
        <button onClick={getCurrentLocation} style={{backgroundColor: '#dc3545', color: 'white', margin: '5px', padding: '10px', width: '100%'}}>📍 Use My GPS Location</button>
        
        <h3>Or Select Your City:</h3>
        <button onClick={() => selectLocation('belagavi')} style={{backgroundColor: '#28a745', color: 'white', margin: '5px', padding: '10px'}}>🗺️ Belagavi</button>
        <button onClick={() => selectLocation('bengaluru')} style={{backgroundColor: '#007bff', color: 'white', margin: '5px', padding: '10px'}}>🗺️ Bengaluru</button>
        <button onClick={() => selectLocation('mumbai')} style={{backgroundColor: '#6f42c1', color: 'white', margin: '5px', padding: '10px'}}>🗺️ Mumbai</button>
      </div>
      {location && (
        <div>
          <p>Latitude: {location.lat}</p>
          <p>Longitude: {location.long}</p>
          <button onClick={testEmergency}>Test Emergency (GPS Location)</button>
        </div>
      )}
      <br/>
      <button onClick={testBelagaviLocation}>Test Emergency (Belagavi Location)</button>
    </div>
  );
};

export default LocationTest;