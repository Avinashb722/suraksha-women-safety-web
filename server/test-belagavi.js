const axios = require('axios');

// Test with Belagavi coordinates
const testBelagavi = async () => {
    const lat = 15.8497;  // Belagavi latitude
    const long = 74.4977; // Belagavi longitude
    
    try {
        console.log('Testing Belagavi location...');
        
        const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}&addressdetails=1`);
        
        console.log('Belagavi Response:');
        console.log('Address:', response.data.display_name);
        console.log('Pincode:', response.data.address?.postcode);
        console.log('City:', response.data.address?.city);
        
    } catch (error) {
        console.error('Location API failed:', error.message);
    }
};

testBelagavi();