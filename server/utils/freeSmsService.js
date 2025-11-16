const axios = require('axios');

// Free SMS service with multiple providers
const sendEmergencySMS = async (phoneNumber, username, lat, long, address) => {
    const message = `🚨 EMERGENCY: ${username} needs help! Location: ${address} Maps: https://maps.google.com/maps?q=${lat},${long}`;
    
    // Try multiple free SMS services
    const services = [
        () => sendViaSMSGatewayCenterFree(phoneNumber, message),
        () => sendViaTextBeltFree(phoneNumber, message),
        () => sendViaFreeSMSAPI(phoneNumber, message)
    ];
    
    for (const service of services) {
        try {
            await service();
            console.log(`Emergency SMS sent to ${phoneNumber}`);
            return true;
        } catch (error) {
            console.log(`SMS service failed: ${error.message}`);
            continue;
        }
    }
    
    console.error(`All SMS services failed for ${phoneNumber}`);
    return false;
};

// SMS Gateway Center (25 free SMS daily)
const sendViaSMSGatewayCenterFree = async (phoneNumber, message) => {
    const response = await axios.post('https://www.smsgateway.center/SMSApi/rest/send', {
        userId: process.env.SMS_GATEWAY_USER || 'demo',
        password: process.env.SMS_GATEWAY_PASS || 'demo',
        senderId: 'EMRGCY',
        message: message.substring(0, 160), // SMS limit
        mobile: phoneNumber
    }, { timeout: 5000 });
    
    if (!response.data.includes('success')) {
        throw new Error('SMS Gateway failed');
    }
};

// TextBelt (1 free SMS daily per phone)
const sendViaTextBeltFree = async (phoneNumber, message) => {
    const response = await axios.post('https://textbelt.com/text', {
        phone: phoneNumber,
        message: message.substring(0, 160),
        key: 'textbelt' // Free tier key
    }, { timeout: 5000 });
    
    if (!response.data.success) {
        throw new Error(response.data.error || 'TextBelt failed');
    }
};

// Free SMS API (limited free tier)
const sendViaFreeSMSAPI = async (phoneNumber, message) => {
    const response = await axios.post('https://api.freesmsapi.com/send', {
        access_token: process.env.FREE_SMS_TOKEN || 'free',
        from: 'EMERGENCY',
        to: phoneNumber,
        text: message.substring(0, 160)
    }, { timeout: 5000 });
    
    if (response.data.status !== 'success') {
        throw new Error('Free SMS API failed');
    }
};

module.exports = { sendEmergencySMS };