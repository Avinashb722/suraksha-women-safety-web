const axios = require('axios');

const testLocation = async () => {
    const lat = 12.9352;
    const long = 77.6245;
    
    try {
        console.log('Testing location API...');
        
        const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}&addressdetails=1`);
        
        console.log('Response:', response.data);
        
        if (response.data && response.data.address) {
            const pincode = response.data.address.postcode || "Unknown";
            const address = response.data.display_name || `Lat: ${lat}, Long: ${long}`;
            
            console.log('Pincode:', pincode);
            console.log('Address:', address);
        } else {
            console.log('No address data found');
        }
        
    } catch (error) {
        console.error('Location API failed:', error.message);
    }
};

testLocation();