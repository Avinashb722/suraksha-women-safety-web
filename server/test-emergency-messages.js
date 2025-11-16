const { sendEmergencyMessages } = require('./utils/simpleEmergency');

// Test emergency messages
async function testEmergencyMessages() {
    console.log('Testing emergency messages...');
    
    // Test user data
    const testUser = {
        uname: 'Test User',
        emergencyMail: 'test@example.com', // Replace with real email
        emergencyNo: '1234567890', // Replace with real phone
        extraEmail1: null,
        extraphone1: null,
        extraEmail2: null,
        extraphone2: null
    };
    
    const lat = '12.9716';
    const long = '77.5946';
    
    try {
        await sendEmergencyMessages(testUser, lat, long);
        console.log('✅ Test completed - check email and SMS');
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

testEmergencyMessages();