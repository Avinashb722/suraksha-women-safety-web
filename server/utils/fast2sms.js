const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config();

const sendFast2SMS = async (phoneNumber, username, lat, long, address) => {
    try {
        const message = `🚨 EMERGENCY: ${username} needs help! Location: ${address} Maps: https://maps.google.com/maps?q=${lat},${long}`;
        
        const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
            method: 'POST',
            headers: {
                'authorization': process.env.FAST2SMS_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                route: 'q',
                message: message,
                language: 'english',
                flash: 0,
                numbers: phoneNumber.toString()
            })
        });
        
        const result = await response.json();
        
        if (result.return) {
            console.log(`Emergency SMS sent to ${phoneNumber}`);
        } else {
            throw new Error(result.message || 'SMS failed');
        }
        
    } catch (error) {
        console.error('Fast2SMS error:', error.message);
        throw error;
    }
};

module.exports = { sendFast2SMS };