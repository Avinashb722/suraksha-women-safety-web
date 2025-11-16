const { sendTwilioEmergency } = require('./utils/twilioSMS');

async function testTwilio() {
    const testUser = {
        uname: 'Abhishek Kumar',
        emergencyNo: '6361243998',
        extraphone1: null,
        extraphone2: null
    };
    
    console.log('Testing Twilio SMS...');
    console.log('Note: Add your Twilio credentials to .env file first');
    
    // Check if credentials are set
    if (!process.env.TWILIO_ACCOUNT_SID || process.env.TWILIO_ACCOUNT_SID === 'your_account_sid_here') {
        console.log('\n❌ Twilio credentials not configured!');
        console.log('📋 Setup steps:');
        console.log('1. Go to https://www.twilio.com/try-twilio');
        console.log('2. Sign up and get $15 free credit');
        console.log('3. Copy Account SID, Auth Token, Phone Number');
        console.log('4. Add to server/.env file');
        console.log('5. Run this test again');
        return;
    }
    
    await sendTwilioEmergency(testUser, '12.9716', '77.5946');
}

testTwilio();