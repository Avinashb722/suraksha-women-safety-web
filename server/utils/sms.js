const twilio = require('twilio');
require('dotenv').config();

// Add these to your .env file:
// TWILIO_ACCOUNT_SID=your_twilio_account_sid
// TWILIO_AUTH_TOKEN=your_twilio_auth_token
// TWILIO_PHONE_NUMBER=your_twilio_phone_number

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendEmergencySMS = async (phoneNumber, username, lat, long, address) => {
    try {
        const message = `🚨 EMERGENCY ALERT 🚨\n\n${username} needs immediate help!\n\nLocation: ${address}\nGoogle Maps: https://maps.google.com/maps?q=${lat},${long}\n\nPlease contact them or call emergency services immediately!`;
        
        await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber
        });
        
        console.log(`Emergency SMS sent to ${phoneNumber}`);
    } catch (error) {
        console.error('SMS sending failed:', error.message);
        throw error;
    }
};

module.exports = { sendEmergencySMS };