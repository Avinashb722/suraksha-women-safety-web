const axios = require('axios');

const testLocationFormatting = async () => {
    const lat = 12.9564672;
    const long = 77.594624;
    
    try {
        const resp = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}&addressdetails=1`, {
            headers: { 'User-Agent': 'WomenSafetyApp/1.0' },
            timeout: 5000
        });
        
        if(resp.data && resp.data.address) {
            const pincode = resp.data.address.postcode || "Unknown";
            const addr = resp.data.address;
            const formattedAddress = `${addr.road || addr.neighbourhood || ''}, ${addr.suburb || ''}, ${addr.city || 'Bengaluru'}, ${addr.state || 'Karnataka'}, ${pincode}`;
            
            console.log('Original:', resp.data.display_name);
            console.log('Improved:', formattedAddress);
            console.log('Pincode:', pincode);
        }
        
    } catch (error) {
        console.error('Error:', error.message);
    }
};

testLocationFormatting();