import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';
import toast from 'react-hot-toast';
import '../styles/weather-safety.css';

const WeatherSafety = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const getSafetyWarning = (weatherMain, description, temp) => {
    const warnings = {
      'Rain': {
        warning: "Heavy rains detected! Avoid travelling alone.",
        tips: ["Use well-lit routes", "Carry umbrella", "Inform someone about your location", "Avoid waterlogged areas"]
      },
      'Thunderstorm': {
        warning: "Thunderstorm alert! Stay indoors if possible.",
        tips: ["Avoid open areas", "Don't use metal objects", "Stay away from trees", "Use covered transport"]
      },
      'Snow': {
        warning: "Snow conditions! Extra caution needed.",
        tips: ["Wear proper footwear", "Walk slowly", "Stay visible", "Keep emergency contacts ready"]
      },
      'Fog': {
        warning: "Low visibility due to fog! Be extra careful.",
        tips: ["Use bright clothing", "Stay on main roads", "Avoid isolated areas", "Keep phone charged"]
      },
      'Clear': {
        warning: temp > 35 ? "Hot weather! Stay hydrated and avoid peak sun hours." : "Good weather conditions!",
        tips: temp > 35 ? ["Carry water", "Wear light colors", "Avoid noon travel", "Stay in shade"] : ["Perfect for outdoor activities", "Still stay alert", "Inform someone about plans"]
      },
      'Clouds': {
        warning: "Cloudy weather - good for travel but stay alert.",
        tips: ["Good visibility", "Comfortable temperature", "Still follow safety protocols", "Keep emergency contacts ready"]
      }
    };
    return warnings[weatherMain] || warnings['Clear'];
  };

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Get user's location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            
            // Using free weather API (no key required)
            const response = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`
            );
            const data = await response.json();
            
            // Convert to our format
            const weatherData = {
              name: "Your Location",
              main: {
                temp: Math.round(data.current_weather.temperature),
                feels_like: Math.round(data.current_weather.temperature + 2),
                humidity: data.hourly.relative_humidity_2m[0] || 65
              },
              weather: [{
                main: getWeatherCondition(data.current_weather.weathercode),
                description: getWeatherDescription(data.current_weather.weathercode),
                icon: "01d"
              }],
              wind: {
                speed: data.current_weather.windspeed
              }
            };
            
            setWeather(weatherData);
            setLoading(false);
            
            // Show popup for dangerous weather
            if (['Rain', 'Thunderstorm', 'Snow', 'Fog'].includes(weatherData.weather[0].main)) {
              setShowAlert(true);
              toast.error('⚠️ Weather Alert! Check safety warnings.', {
                duration: 6000,
                position: 'top-center'
              });
            }
          }, (error) => {
            // Fallback to default location if geolocation fails
            fetchDefaultWeather();
          });
        } else {
          fetchDefaultWeather();
        }
      } catch (err) {
        setError('Unable to fetch weather data');
        setLoading(false);
      }
    };

    const fetchDefaultWeather = async () => {
      try {
        // Default to Delhi coordinates
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=28.6139&longitude=77.2090&current_weather=true&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`
        );
        const data = await response.json();
        
        const weatherData = {
          name: "Delhi, India",
          main: {
            temp: Math.round(data.current_weather.temperature),
            feels_like: Math.round(data.current_weather.temperature + 2),
            humidity: data.hourly.relative_humidity_2m[0] || 65
          },
          weather: [{
            main: getWeatherCondition(data.current_weather.weathercode),
            description: getWeatherDescription(data.current_weather.weathercode),
            icon: "01d"
          }],
          wind: {
            speed: data.current_weather.windspeed
          }
        };
        
        setWeather(weatherData);
        setLoading(false);
        
        if (['Rain', 'Thunderstorm', 'Snow', 'Fog'].includes(weatherData.weather[0].main)) {
          setShowAlert(true);
          toast.error('⚠️ Weather Alert! Check safety warnings.', {
            duration: 6000,
            position: 'top-center'
          });
        }
      } catch (err) {
        setError('Unable to fetch weather data');
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const getWeatherCondition = (code) => {
    if (code >= 61 && code <= 67) return 'Rain';
    if (code >= 95 && code <= 99) return 'Thunderstorm';
    if (code >= 71 && code <= 77) return 'Snow';
    if (code >= 45 && code <= 48) return 'Fog';
    if (code >= 1 && code <= 3) return 'Clouds';
    return 'Clear';
  };

  const getWeatherDescription = (code) => {
    const descriptions = {
      0: 'clear sky',
      1: 'mainly clear',
      2: 'partly cloudy',
      3: 'overcast',
      45: 'fog',
      48: 'depositing rime fog',
      51: 'light drizzle',
      61: 'slight rain',
      63: 'moderate rain',
      65: 'heavy rain',
      71: 'slight snow',
      73: 'moderate snow',
      75: 'heavy snow',
      95: 'thunderstorm',
      96: 'thunderstorm with hail'
    };
    return descriptions[code] || 'unknown';
  };

  const getWeatherIcon = (condition) => {
    const icons = {
      'Clear': '☀️',
      'Clouds': '☁️',
      'Rain': '🌧️',
      'Thunderstorm': '⛈️',
      'Snow': '❄️',
      'Fog': '🌫️'
    };
    return icons[condition] || '☀️';
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="weather-container">
          <div className="container mt-5 pt-5">
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-white">Fetching weather data...</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="weather-container">
          <div className="container mt-5 pt-5">
            <div className="alert alert-danger text-center">
              <h4>Weather Service Unavailable</h4>
              <p>{error}</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const safetyInfo = getSafetyWarning(weather.weather[0].main, weather.weather[0].description, weather.main.temp);
  const isDangerous = ['Rain', 'Thunderstorm', 'Snow', 'Fog'].includes(weather.weather[0].main);

  return (
    <>
      <Navbar />
      
      {/* Weather Alert Popup */}
      {showAlert && isDangerous && (
        <div className="weather-popup-overlay" onClick={() => setShowAlert(false)}>
          <div className="weather-popup" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h3>⚠️ Safety Alert</h3>
              <button className="close-btn" onClick={() => setShowAlert(false)}>×</button>
            </div>
            <div className="popup-content">
              <p className="alert-text">{safetyInfo.warning}</p>
              <h4>Safety Tips:</h4>
              <ul className="popup-tips">
                {safetyInfo.tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
              <button className="ok-btn" onClick={() => setShowAlert(false)}>Got it!</button>
            </div>
          </div>
        </div>
      )}
      <div className="weather-container">
        <div className="container mt-5 pt-5">
          <h1 className="text-center mb-5 text-white">Weather & Safety Alert</h1>
          
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="weather-card">
                <div className="weather-header">
                  <div className="weather-icon">
                    {getWeatherIcon(weather.weather[0].main)}
                  </div>
                  <div className="weather-info">
                    <h2>{weather.name}</h2>
                    <h3>{Math.round(weather.main.temp)}°C</h3>
                    <p>{weather.weather[0].description}</p>
                  </div>
                </div>

                <div className="weather-details">
                  <div className="detail-item">
                    <span>Feels like</span>
                    <span>{Math.round(weather.main.feels_like)}°C</span>
                  </div>
                  <div className="detail-item">
                    <span>Humidity</span>
                    <span>{weather.main.humidity}%</span>
                  </div>
                  <div className="detail-item">
                    <span>Wind Speed</span>
                    <span>{weather.wind.speed} m/s</span>
                  </div>
                </div>

                <div className="safety-alert">
                  <div className="alert-header">
                    <h3>⚠️ Safety Alert</h3>
                  </div>
                  <div className="alert-content">
                    <p className="warning-text">{safetyInfo.warning}</p>
                    <h4>Safety Tips:</h4>
                    <ul className="safety-tips">
                      {safetyInfo.tips.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="emergency-contacts">
                  <h4>Emergency Contacts</h4>
                  <div className="contact-grid">
                    <div className="contact-item">
                      <span>Police</span>
                      <span>100</span>
                    </div>
                    <div className="contact-item">
                      <span>Emergency</span>
                      <span>112</span>
                    </div>
                    <div className="contact-item">
                      <span>Women Helpline</span>
                      <span>1091</span>
                    </div>
                  </div>
                </div>
                
                {isDangerous && (
                  <div className="alert-banner" onClick={() => setShowAlert(true)}>
                    <span>⚠️ Tap to view safety alert again</span>
                  </div>
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

export default WeatherSafety;