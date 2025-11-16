// Using SMS Gateway Center (truly free 25 SMS)
const axios = require('axios');

const sendFreeSMS = async (phoneNumber, username, lat, long, address) => {
    try {
        const message = `🚨 EMERGENCY: ${username} needs help! Location: ${address} Maps: https://maps.google.com/maps?q=${lat},${long}`;
        
        // SMS Gateway Center API (25 free SMS)
        const response = await axios.post('https://www.smsgateway.center/SMSApi/rest/send', {
            userId: 'your_user_id',
            password: 'your_password', 
            senderId: 'SMSGAT',
            message: message,
            mobile: phoneNumber
        });
        
        console.log('Free SMS sent:', response.data);
        
    } catch (error) {
        console.error('Free SMS failed:', error.message);
        
        // Fallback: Use browser notification API or WhatsApp Web
        console.log('Fallback: Send via WhatsApp Web or browser notification');
    }
};

module.exports = { sendFreeSMS };