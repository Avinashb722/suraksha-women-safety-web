import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';
import toast from 'react-hot-toast';
import '../styles/police-map.css';

const PoliceMap = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [mapSrc, setMapSrc] = useState('');
  const [policeStations, setPoliceStations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      toast.loading('Getting your location...', { id: 'location' });
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          
          toast.success('Location found!', { id: 'location' });
          
          const mapUrl = `https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d7000!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1spolice%20station!5e0!3m2!1sen!2sin!4v${Date.now()}!5m2!1sen!2sin`;
          setMapSrc(mapUrl);
          
          fetchNearbyStations(latitude, longitude);
        },
        (error) => {
          toast.error('Location access denied', { id: 'location' });
          setLoading(false);
        }
      );
    } else {
      toast.error('Geolocation not supported');
      setLoading(false);
    }
  };

  const fetchNearbyStations = async (lat, lng) => {
    try {
      const query = `
        [out:json][timeout:25];
        (
          node["amenity"="police"](around:5000,${lat},${lng});
          way["amenity"="police"](around:5000,${lat},${lng});
        );
        out center meta;
      `;
      
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query
      });
      
      const data = await response.json();
      
      const stations = data.elements.map(element => {
        const stationLat = element.lat || element.center?.lat;
        const stationLng = element.lon || element.center?.lon;
        const name = element.tags?.name || 'Police Station';
        const phone = element.tags?.phone || '100';
        
        return {
          name,
          phone,
          lat: stationLat,
          lng: stationLng,
          distance: calculateDistance(lat, lng, stationLat, stationLng)
        };
      }).filter(station => station.lat && station.lng)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 5);
      
      setPoliceStations(stations);
      toast.success(`Found ${stations.length} nearby stations`);
    } catch (error) {
      setPoliceStations([
        { name: "Emergency Police", phone: "100", distance: 0 },
        { name: "Women Helpline", phone: "1091", distance: 0 }
      ]);
    }
    setLoading(false);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const showOnMap = (station) => {
    if (station.lat && station.lng) {
      // Create detailed map view with marker and info popup
      const query = encodeURIComponent(`${station.name} police station`);
      const detailedMapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1200!2d${station.lng}!3d${station.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s${query}!5e0!3m2!1sen!2sin!4v${Date.now()}`;
      
      setMapSrc(detailedMapUrl);
      toast.success(`📍 Viewing ${station.name} details`);
    }
  };

  const navigate = (station) => {
    if (station.lat && station.lng) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`;
      window.open(url, '_blank');
      toast.success('Opening navigation...');
    }
  };

  const showAllStations = () => {
    if (userLocation) {
      const mapUrl = `https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d7000!2d${userLocation.lng}!3d${userLocation.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1spolice%20station!5e0!3m2!1sen!2sin!4v${Date.now()}!5m2!1sen!2sin`;
      setMapSrc(mapUrl);
    }
  };

  return (
    <>
      <Navbar />
      <div className="police-map-container">
        <div className="container mt-5 pt-5">
          <h1 className="text-center mb-4 text-white">🚔 Nearby Police Stations</h1>
          
          <div className="row">
            <div className="col-md-8">
              <div className="map-card">
                <div className="map-header">
                  <h3>📍 Police Stations Near You</h3>
                  <button className="btn btn-secondary btn-sm" onClick={showAllStations}>
                    Show All Stations
                  </button>
                </div>
                
                <div className="map-container">
                  {loading ? (
                    <div className="map-loading">
                      <div className="spinner-border text-primary"></div>
                      <p>Getting your location...</p>
                    </div>
                  ) : mapSrc ? (
                    <iframe
                      src={mapSrc}
                      width="100%"
                      height="400"
                      style={{ border: 0, borderRadius: '10px' }}
                      allowFullScreen=""
                      loading="lazy"
                      title="Police Stations Map"
                    ></iframe>
                  ) : (
                    <div className="map-loading">
                      <p>Please allow location access</p>
                      <button className="btn btn-primary" onClick={getCurrentLocation}>
                        Try Again
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="info-card">
                <h4>🚨 Emergency Contacts</h4>
                <div className="emergency-list">
                  <div className="emergency-item">
                    <span className="number">100</span>
                    <span className="label">Police</span>
                  </div>
                  <div className="emergency-item">
                    <span className="number">112</span>
                    <span className="label">Emergency</span>
                  </div>
                  <div className="emergency-item">
                    <span className="number">1091</span>
                    <span className="label">Women Helpline</span>
                  </div>
                </div>
                
                <h4 className="mt-4">📞 Nearby Stations</h4>
                <div className="station-list">
                  {policeStations.map((station, index) => (
                    <div key={index} className="station-item">
                      <h6>{station.name}</h6>
                      <p className="phone">📞 {station.phone}</p>
                      {station.distance && (
                        <p className="distance">📍 {station.distance.toFixed(1)} km away</p>
                      )}
                      <div className="station-actions">
                        <button 
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => showOnMap(station)}
                        >
                          🗺️ View
                        </button>
                        <button 
                          className="btn btn-sm btn-success"
                          onClick={() => navigate(station)}
                        >
                          🧭 Navigate
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PoliceMap;