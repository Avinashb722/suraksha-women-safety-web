const { sendCompleteFreeEmergency } = require('./completeFreeEmergency');
const { sendTwilioEmergency } = require('./twilioSMS');

const sendHybridEmergency = async (user, lat, long) => {
    console.log('\n🚨 HYBRID EMERGENCY SYSTEM 🚨');
    console.log('Trying best available messaging options...');
    
    // Always send free alerts first
    console.log('\n🆓 Sending FREE alerts...');
    await sendCompleteFreeEmergency(user, lat, long);
    
    // Try Twilio SMS if configured
    console.log('\n📱 Checking Twilio SMS...');
    const twilioSent = await sendTwilioEmergency(user, lat, long);
    
    console.log('\n📊 HYBRID EMERGENCY SUMMARY:');
    console.log('✅ Free alerts: Email + WhatsApp links + Calls');
    console.log(`📱 Twilio SMS: ${twilioSent > 0 ? `${twilioSent} sent` : 'Not configured'}`);
    console.log('💰 Total cost: ₹0 (free) + ₹' + (twilioSent * 0.60) + ' (Twilio)');
    
    return { free: true, twilio: twilioSent };
};

module.exports = { sendHybridEmergency };