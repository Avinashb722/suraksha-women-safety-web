const mongoose = require('mongoose');
const { User } = require('./models/userModel');
const { sendTwilioEmergency } = require('./utils/twilioSMS');
const { sendEmergencyMessages } = require('./utils/simpleEmergency');
require('dotenv').config();

async function testRealEmergency() {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to database');
        
        // Find a user with emergency contacts
        const user = await User.findOne({ 
            $or: [
                { emergencyMail: { $exists: true, $ne: null } },
                { emergencyNo: { $exists: true, $ne: null } }
            ]
        });
        
        if (!user) {
            console.log('No user with emergency contacts found');
            return;
        }
        
        console.log('\n🚨 TESTING EMERGENCY SYSTEM 🚨');
        console.log('User:', user.uname);
        console.log('Email:', user.emergencyMail);
        console.log('Phone:', user.emergencyNo);
        
        const lat = '12.9716';
        const long = '77.5946';
        
        // Test Twilio SMS
        if (user.emergencyNo) {
            console.log('\n📱 Testing Twilio SMS...');
            await sendTwilioEmergency(user, lat, long);
        }
        
        // Test Email
        if (user.emergencyMail) {
            console.log('\n📧 Testing Emergency Email...');
            await sendEmergencyMessages(user, lat, long);
        }
        
        console.log('\n✅ Emergency test completed!');
        mongoose.disconnect();
        
    } catch (error) {
        console.error('❌ Emergency test failed:', error.message);
    }
}

testRealEmergency();