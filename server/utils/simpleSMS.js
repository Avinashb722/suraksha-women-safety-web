const https = require('https');
require('dotenv').config();

const sendSimpleSMS = async (phoneNumber, message) => {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            route: 'q',
            message: message.substring(0, 160),
            language: 'english',
            flash: 0,
            numbers: phoneNumber
        });

        const options = {
            hostname: 'www.fast2sms.com',
            port: 443,
            path: '/dev/bulkV2',
            method: 'POST',
            headers: {
                'authorization': process.env.FAST2SMS_API_KEY,
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = https.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            res.on('end', () => {
                try {
                    const result = JSON.parse(responseData);
                    console.log('SMS Response:', result);
                    if (result.return) {
                        console.log(`✅ SMS sent to ${phoneNumber}`);
                        resolve(true);
                    } else {
                        console.log(`❌ SMS failed: ${result.message}`);
                        resolve(false);
                    }
                } catch (error) {
                    console.log('❌ SMS parse error:', error);
                    resolve(false);
                }
            });
        });

        req.on('error', (error) => {
            console.log('❌ SMS request error:', error);
            resolve(false);
        });

        req.write(data);
        req.end();
    });
};

const sendEmergencySMSOnly = async (user, lat, long) => {
    const message = `🚨 EMERGENCY: ${user.uname} needs help! Location: ${lat}, ${long} Maps: https://maps.google.com/maps?q=${lat},${long}`;
    
    const phones = [user.emergencyNo, user.extraphone1, user.extraphone2].filter(Boolean);
    
    console.log('Sending SMS to phones:', phones);
    
    for (const phone of phones) {
        await sendSimpleSMS(phone.toString(), message);
    }
};

module.exports = { sendEmergencySMSOnly };