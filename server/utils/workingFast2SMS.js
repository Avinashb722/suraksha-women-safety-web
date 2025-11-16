const https = require('https');

const sendFast2SMSReal = async (phoneNumber, message) => {
    return new Promise((resolve) => {
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
                'authorization': 'BSUo8a5qVthEJfxKDI4Nbw3ZPelWcQ1rGRjv60AzYp2mOn7TXgsXgHclJuTUpLd8fCSDtk7GMAmPxBYK',
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => responseData += chunk);
            res.on('end', () => {
                try {
                    const result = JSON.parse(responseData);
                    console.log('Fast2SMS Response:', result);
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

const sendWorkingFast2SMS = async (user, lat, long) => {
    const message = `🚨 EMERGENCY: ${user.uname} needs help! Location: ${lat}, ${long} Maps: https://maps.google.com/maps?q=${lat},${long}`;
    
    const phones = [user.emergencyNo, user.extraphone1, user.extraphone2].filter(Boolean);
    
    console.log('Sending SMS with DLT route - ₹0.25 per SMS');
    
    for (const phone of phones) {
        await sendFast2SMSReal(phone, message);
    }
    
    return phones.length;
};

module.exports = { sendWorkingFast2SMS };