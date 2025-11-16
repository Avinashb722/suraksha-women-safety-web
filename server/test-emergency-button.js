const axios = require('axios');

async function testEmergencyButton() {
    try {
        console.log('Testing Emergency Button API...');
        
        // Test emergency API call
        const response = await axios.post('http://localhost:5001/api/v1/emergency', {
            userId: '507f1f77bcf86cd799439011', // Test user ID
            lat: '12.9716',
            long: '77.5946'
        });
        
        console.log('✅ Emergency API Response:', response.data);
        console.log('🚨 Emergency button is working!');
        
    } catch (error) {
        if (error.response) {
            console.log('❌ API Error:', error.response.data);
        } else {
            console.log('❌ Network Error:', error.message);
        }
        console.log('💡 Make sure server is running on port 5001');
    }
}

testEmergencyButton();