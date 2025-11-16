// This will test location with coordinates you provide
const axios = require('axios');

const testRealLocation = async (lat, long) => {
    try {
        console.log(`Testing your coordinates: ${lat}, ${long}`);
        
        const resp = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}&addressdetails=1`, {
            headers: { 'User-Agent': 'WomenSafetyApp/1.0' },
            timeout: 5000
        });
        
        if(resp.data && resp.data.address) {
            const pincode = resp.data.address.postcode || "Unknown";
            const addr = resp.data.address;
            const formattedAddress = `${addr.road || addr.neighbourhood || ''}, ${addr.suburb || ''}, ${addr.city || 'Unknown City'}, ${addr.state || 'Unknown State'}, ${pincode}`;
            
            console.log('Your Location:', formattedAddress);
            console.log('Pincode:', pincode);
        }
        
    } catch (error) {
        console.error('Error:', error.message);
    }
};

// Usage: node get-real-location.js
// You need to provide your actual GPS coordinates
console.log('To test your real location, open browser and go to:');
console.log('http://localhost:3000 -> LocationTest page');
console.log('Click "Get My Location" to see your actual coordinates');