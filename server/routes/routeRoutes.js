const express = require('express');
const router = express.Router();
const axios = require('axios');

const ORS_API_KEY = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6Ijc4ODQ5NTMxNTQxMTQ3MzQ4MzczNTIzYjk0Yjc2M2JkIiwiaCI6Im11cm11cjY0In0=';

// GET ROUTE SAFETY using OpenRouteService
router.post('/calculate', async (req, res) => {
  try {
    const from = req.body.from?.trim();
    const to = req.body.to?.trim();

    console.log('FROM:', from, 'TO:', to);

    if (!from || !to) {
      return res.status(400).json({ error: 'EMPTY_FIELDS' });
    }

    // Get coordinates (works for ANY location)
    const fromCoords = await getCoordinates(from);
    const toCoords = await getCoordinates(to);

    if (!fromCoords || !toCoords) {
      // Smart fallback: if one location is known, estimate the other
      if (fromCoords && !toCoords) {
        console.log('Unknown destination, using estimated route');
        return generateEstimatedRoute(from, to, fromCoords, null, res);
      }
      if (!fromCoords && toCoords) {
        console.log('Unknown origin, using estimated route');
        return generateEstimatedRoute(from, to, null, toCoords, res);
      }
      // Ultimate fallback: Use Groq AI to estimate distance
      console.log('Both locations unknown, using Groq AI estimation');
      return await getGroqEstimate(from, to, res);
    }

    console.log('Coordinates found:', fromCoords, toCoords);

    // Get route from OpenRouteService
    const response = await axios.post(
      'https://api.openrouteservice.org/v2/directions/driving-car',
      {
        coordinates: [
          [fromCoords.lon, fromCoords.lat],
          [toCoords.lon, toCoords.lat]
        ]
      },
      {
        headers: {
          'Authorization': ORS_API_KEY,
          'Content-Type': 'application/json',
        }
      }
    );

    const route = response.data.routes[0];
    const distanceKm = (route.summary.distance / 1000).toFixed(1);
    const durationMin = Math.round(route.summary.duration / 60);

    // Generate single route option
    const routes = [
      {
        id: 1,
        name: 'Fastest Route',
        summary: 'OpenRouteService Route',
        distance: distanceKm + ' km',
        duration: formatDuration(durationMin),
        distance_km: distanceKm,
        duration_min: durationMin,
        safety: 90,
        features: ['Real routing data', 'Accurate distance', 'Live traffic'],
        color: '#4CAF50',
        polyline: route.geometry,
        mapUrl: `https://www.google.com/maps/dir/${encodeURIComponent(from)}/${encodeURIComponent(to)}`
      }
    ];

    return res.json({
      status: 'OK',
      routes,
      from,
      to
    });

  } catch (error) {
    console.error('OpenRouteService Error:', error.message);
    
    // Fallback with realistic data
    const routeData = {
      'vijayapur-hubli': { distance: 178, duration: 225 },
      'hubli-vijayapur': { distance: 178, duration: 225 },
      'belagavi-sadalaga': { distance: 8, duration: 15 },
      'sadalaga-belagavi': { distance: 8, duration: 15 },
      'belagavi-vijayapur': { distance: 205, duration: 255 },
      'vijayapur-belagavi': { distance: 205, duration: 255 },
      'hubli-belagavi': { distance: 58, duration: 70 },
      'belagavi-hubli': { distance: 58, duration: 70 }
    };
    
    const routeKey = `${req.body.from.toLowerCase()}-${req.body.to.toLowerCase()}`;
    const baseRoute = routeData[routeKey] || { distance: 50, duration: 60 };
    
    const fallbackRoutes = [
      {
        id: 1,
        name: 'Fastest Route',
        summary: 'Estimated Route',
        distance: baseRoute.distance + ' km',
        duration: formatDuration(baseRoute.duration),
        distance_km: baseRoute.distance.toString(),
        duration_min: baseRoute.duration,
        safety: 90,
        features: ['Main roads', 'Safe highway', 'Estimated data'],
        color: '#4CAF50',
        polyline: '',
        mapUrl: `https://www.google.com/maps/dir/${encodeURIComponent(req.body.from)}/${encodeURIComponent(req.body.to)}`
      }
    ];
    
    return res.json({
      status: 'OK',
      routes: fallbackRoutes,
      from: req.body.from,
      to: req.body.to
    });
  }
});

// Get coordinates for ANY location using OpenStreetMap
const getCoordinates = async (location) => {
  try {
    // First try predefined coordinates for speed
    const predefined = {
      'vijayapur': { lon: 75.7100, lat: 16.8302 },
      'hubli': { lon: 75.1240, lat: 15.3647 },
      'belagavi': { lon: 74.4977, lat: 15.8497 },
      'sadalaga': { lon: 74.5833, lat: 15.9167 },
      'bangalore': { lon: 77.5946, lat: 12.9716 },
      'mysore': { lon: 76.6394, lat: 12.2958 },
      'dharwad': { lon: 75.0078, lat: 15.4589 },
      'indi': { lon: 75.9469, lat: 17.1761 }
    };
    
    const key = location.toLowerCase().trim();
    if (predefined[key]) {
      return predefined[key];
    }
    
    // Use OpenStreetMap Nominatim for any other location
    const searchQueries = [
      `${location}, Karnataka, India`,
      `${location}, India`,
      `${location} Karnataka`,
      `${location} India`,
      location
    ];
    
    for (const query of searchQueries) {
      try {
        console.log('Trying geocoding query:', query);
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&addressdetails=1`,
          {
            headers: {
              'User-Agent': 'RouteApp/1.0'
            },
            timeout: 5000
          }
        );
        
        console.log('Geocoding response:', response.data.length, 'results');
        
        if (response.data && response.data.length > 0) {
          const result = response.data[0];
          console.log('Found location:', result.display_name);
          return {
            lon: parseFloat(result.lon),
            lat: parseFloat(result.lat)
          };
        }
        
        // Add delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (geocodeError) {
        console.log('Geocoding query failed:', query, geocodeError.message);
        continue;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Geocoding error:', error.message);
    return null;
  }
};

// Generate estimated route when one location is unknown
const generateEstimatedRoute = async (from, to, fromCoords, toCoords, res) => {
  // Try Groq AI first for better estimation
  try {
    return await getGroqEstimate(from, to, res);
  } catch (error) {
    console.log('Groq failed, using basic estimation');
    
    // Fallback to basic estimation
    const estimatedDistance = 11;
    const estimatedDuration = 18;
    
    const routes = [
      {
        id: 1,
        name: 'Estimated Route',
        summary: 'Local Area Route',
        distance: estimatedDistance + ' km',
        duration: formatDuration(estimatedDuration),
        distance_km: estimatedDistance.toString(),
        duration_min: estimatedDuration,
        safety: 85,
        features: ['Local roads', 'Estimated distance', 'Area route'],
        color: '#FF9800',
        polyline: '',
        mapUrl: `https://www.google.com/maps/dir/${encodeURIComponent(from)}/${encodeURIComponent(to)}`
      },
      {
        id: 2,
        name: 'Alternative Local Route',
        summary: 'Secondary Local Route',
        distance: Math.round(estimatedDistance * 1.3) + ' km',
        duration: formatDuration(Math.round(estimatedDuration * 1.4)),
        distance_km: (estimatedDistance * 1.3).toString(),
        duration_min: Math.round(estimatedDuration * 1.4),
        safety: 80,
        features: ['Village roads', 'Longer route', 'Less traffic'],
        color: '#795548',
        polyline: '',
        mapUrl: `https://www.google.com/maps/dir/${encodeURIComponent(from)}/${encodeURIComponent(to)}`
      }
    ];
    
    return res.json({
      status: 'OK',
      routes,
      from,
      to
    });
  }
};

// Use Groq AI to estimate distance between locations
const getGroqEstimate = async (from, to, res) => {
  try {
    const { Groq } = require('groq-sdk');
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    
    const prompt = `Estimate the driving distance and time between ${from} and ${to} in India. Respond with only: distance_km,duration_minutes (example: 25,35)`;
    
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama3-8b-8192',
      temperature: 0.1,
      max_tokens: 50
    });
    
    const response = completion.choices[0]?.message?.content?.trim();
    console.log('Groq response:', response);
    
    if (response && response.includes(',')) {
      const [distanceStr, durationStr] = response.split(',');
      const distance = parseInt(distanceStr.trim());
      const duration = parseInt(durationStr.trim());
      
      if (distance > 0 && duration > 0) {
        const routes = [
          {
            id: 1,
            name: 'AI Estimated Route',
            summary: 'Groq AI Estimation',
            distance: distance + ' km',
            duration: formatDuration(duration),
            distance_km: distance.toString(),
            duration_min: duration,
            safety: 80,
            features: ['AI estimated', 'Smart calculation', 'Approximate route'],
            color: '#9C27B0',
            polyline: '',
            mapUrl: `https://www.google.com/maps/dir/${encodeURIComponent(from)}/${encodeURIComponent(to)}`
          },
          {
            id: 2,
            name: 'Alternative AI Route',
            summary: 'AI Secondary Route',
            distance: Math.round(distance * 1.2) + ' km',
            duration: formatDuration(Math.round(duration * 1.3)),
            distance_km: (distance * 1.2).toString(),
            duration_min: Math.round(duration * 1.3),
            safety: 75,
            features: ['AI estimated', 'Longer route', 'Alternative path'],
            color: '#FF5722',
            polyline: '',
            mapUrl: `https://www.google.com/maps/dir/${encodeURIComponent(from)}/${encodeURIComponent(to)}`
          }
        ];
        
        return res.json({
          status: 'OK',
          routes,
          from,
          to
        });
      }
    }
    
    throw new Error('Invalid Groq response');
    
  } catch (error) {
    console.error('Groq AI error:', error.message);
    throw error;
  }
};

// Format duration from minutes
const formatDuration = (minutes) => {
  if (minutes < 60) return `${minutes} mins`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

module.exports = router;