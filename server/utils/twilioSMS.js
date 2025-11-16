const twilio = require('twilio');
require('dotenv').config();

// Initialize Twilio client (only if credentials exist)
let client = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && 
    process.env.TWILIO_ACCOUNT_SID.startsWith('AC')) {
    client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

const sendTwilioSMS = async (phoneNumber, message) => {
    if (!client) {
        console.log('❌ Twilio not configured. Add credentials to .env file.');
        return false;
    }
    
    try {
        const result = await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: `+91${phoneNumber}` // Add India country code
        });

        console.log(`✅ Twilio SMS sent to ${phoneNumber}`);
        console.log(`   Message SID: ${result.sid}`);
        console.log(`   Status: ${result.status}`);
        console.log(`   Cost: ~₹0.60`);
        
        return true;
    } catch (error) {
        console.log(`❌ Twilio SMS failed: ${error.message}`);
        return false;
    }
};

const sendTwilioEmergency = async (user, lat, long) => {
    const message = `${user.uname} needs help! goo.gl/maps?q=${lat},${long}`;
    
    const phones = [user.emergencyNo, user.extraphone1, user.extraphone2].filter(Boolean);
    
    console.log('\n TWILIO EMERGENCY SMS SYSTEM 📱');
    console.log(' Reliable global SMS delivery');
    console.log(' Cost: ₹0.60 per SMS (8x cheaper than Fast2SMS)');
    
    let successCount = 0;
    for (const phone of phones) {
        const success = await sendTwilioSMS(phone, message);
        if (success) successCount++;
    }
    
    console.log(`\n📊 TWILIO SUMMARY:`);
    console.log(`✅ SMS sent: ${successCount}/${phones.length}`);
    console.log(`💰 Total cost: ₹${successCount * 0.60}`);
    console.log(`🎯 Success rate: ${Math.round(successCount/phones.length*100)}%`);
    
    return successCount;
};

module.exports = { sendTwilioEmergency, sendTwilioSMS };