const https = require('https');

const sendTextBeltSMS = async (phoneNumber, message) => {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            phone: phoneNumber,
            message: message.substring(0, 160),
            key: 'textbelt'
        });

        const options = {
            hostname: 'textbelt.com',
            port: 443,
            path: '/text',
            method: 'POST',
            headers: {
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
                    console.log('TextBelt Response:', result);
                    if (result.success) {
                        console.log(`✅ Free SMS sent to ${phoneNumber}`);
                        resolve(true);
                    } else {
                        console.log(`❌ Free SMS failed: ${result.error}`);
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

const sendFreeSMSEmergency = async (user, lat, long) => {
    const message = `🚨 EMERGENCY: ${user.uname} needs help! Location: ${lat}, ${long} Maps: https://maps.google.com/maps?q=${lat},${long}`;
    
    const phones = [user.emergencyNo, user.extraphone1, user.extraphone2].filter(Boolean);
    
    console.log('Sending FREE SMS to phones:', phones);
    
    for (const phone of phones) {
        await sendTextBeltSMS(phone.toString(), message);
    }
};

module.exports = { sendFreeSMSEmergency };