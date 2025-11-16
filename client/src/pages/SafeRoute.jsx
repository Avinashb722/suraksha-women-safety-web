import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';

const SafeRoute = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);

  const findSafeRoutes = async () => {
    if (!from || !to) {
      toast.error('Please enter both locations');
      return;
    }

    setLoading(true);
    
    try {
      const trimmedFrom = from.trim();
      const trimmedTo = to.trim();
      
      if (!trimmedFrom || !trimmedTo) {
        toast.error('Please enter both locations.');
        setLoading(false);
        return;
      }
      
      // Normalize inputs (important)
      const normalize = (text) => text.trim().toLowerCase();
      
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/v1/routes/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: normalize(trimmedFrom),
          to: normalize(trimmedTo)
        })
      });
      
      const data = await response.json();
      
      console.log('Response status:', response.status);
      console.log('Response data:', data);
      
      // Handle backend errors
      if (!response.ok) {
        console.log('Error response:', data.error);
        if (data.error === 'EMPTY_FIELDS') {
          toast.error('❌ Please enter both locations');
        } else if (data.error === 'LOCATION_NOT_FOUND') {
          toast.error('❌ Location not found. Try: Belagavi, Sadalaga, Hubli, Vijayapur');
        } else if (data.error === 'NO_ROUTES') {
          toast.error('❌ No routes found between these locations.');
        } else if (data.error === 'SERVER_ERROR') {
          toast.error('❌ Server error. Try again later.');
        } else {
          toast.error('❌ Failed to calculate route.');
        }
        setRoutes([]);
        setLoading(false);
        return;
      }
      
      // Success
      console.log('Routes received:', data.routes);
      setRoutes(data.routes);
      toast.success('✅ Route found!');
      
    } catch (error) {
      console.log(error);
      toast.error('❌ Something went wrong.');
      setRoutes([]);
    }
    
    setLoading(false);
  };




  
  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
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
              <h2 className="text-center mb-4">🗺️ Route Safety Analyzer</h2>
              <p className="text-center mb-4">Real-time route analysis with accurate distances</p>
              
              <div className="row mb-3">
                <div className="col-md-6">
                  <input 
                    type="text"
                    className="form-control"
                    placeholder="Vijayapur"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                  />
                  <small className="text-light mt-1 d-block">✔ Try: Belagavi, Hubli, Vijayapur, Sadalaga</small>
                </div>
                <div className="col-md-6">
                  <input 
                    type="text"
                    className="form-control"
                    placeholder="Hubli"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                  />
                  <small className="text-light mt-1 d-block">✔ Avoid spelling mistakes</small>
                </div>
              </div>
              <div className="text-center mb-3">
                <small className="text-light">✔ Full city names work best</small>
              </div>
              
              <div className="text-center mb-4">
                <button 
                  className="btn btn-light btn-lg"
                  onClick={findSafeRoutes}
                  disabled={loading}
                >
                  {loading ? '🔍 Finding Safe Routes...' : '🛡️ Find Safe Routes'}
                </button>
              </div>
            </div>
          </div>

          {routes.length > 0 && (
            <div className="mt-4">
              <div className="alert alert-info">
                <strong>📍 Route Analysis:</strong> {from} → {to}
              </div>
              {routes.map(route => (
                <div key={route.id} className="card mb-3 shadow">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="flex-grow-1">
                        <h5 className="card-title d-flex align-items-center">
                          <span className="me-2">{route.name}</span>
                          <span className="badge" style={{backgroundColor: route.color, color: 'white'}}>
                            {route.safety}% Safe
                          </span>
                        </h5>
                        <div className="row mb-2">
                          <div className="col-auto">
                            <strong>📏 {route.distance}</strong>
                          </div>
                          <div className="col-auto">
                            <strong>⏱️ {route.duration}</strong>
                          </div>
                        </div>
                        <div className="mb-2">
                          {route.features.map((feature, idx) => (
                            <span key={idx} className="badge bg-secondary me-1 mb-1">{feature}</span>
                          ))}
                        </div>
                      </div>
                      <div className="text-center ms-3">
                        <div 
                          className="safety-score mb-2"
                          style={{
                            width: '70px',
                            height: '70px',
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${route.color}, ${route.color}dd)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                          }}
                        >
                          {route.safety}%
                        </div>
                        <a 
                          href={route.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary btn-sm"
                          style={{fontSize: '12px'}}
                        >
                          🗺️ Open in Maps
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="alert alert-warning mt-3">
                <small>
                  <strong>⚠️ Safety Tips:</strong> Always inform someone about your travel plans. 
                  Choose well-lit, populated routes especially during night hours.
                </small>
              </div>
            </div>
          )}
        </div>
      </div>
        </div>
      </div>
    <Footer />
    </>
  );
};

export default SafeRoute;