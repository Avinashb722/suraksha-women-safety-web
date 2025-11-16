const https = require('https');

const sendShortSMS = async (phoneNumber, message) => {
    // Keep message under 160 characters to avoid multiple SMS charges
    const shortMessage = message.substring(0, 160);
    
    return new Promise((resolve) => {
        const data = JSON.stringify({
            route: 'q',
            message: shortMessage,
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
                    if (result.return) {
                        console.log(`✅ SMS sent to ${phoneNumber} - ₹5.00 (1 SMS part)`);
                        resolve(true);
                    } else {
                        console.log(`❌ SMS failed: ${result.message}`);
                        resolve(false);
                    }
                } catch (error) {
                    resolve(false);
                }
            });
        });

        req.on('error', () => resolve(false));
        req.write(data);
        req.end();
    });
};

const sendShortEmergencySMS = async (user, lat, long) => {
    // Short message under 160 chars = ₹5 only
    const shortMessage = `🚨 EMERGENCY: ${user.uname} needs help! Location: ${lat},${long}`;
    
    console.log(`Message length: ${shortMessage.length} chars (${shortMessage.length <= 160 ? '1 SMS' : 'Multiple SMS'})`);
    console.log(`Cost per contact: ₹${shortMessage.length <= 160 ? '5' : '15+'}`);
    
    const phones = [user.emergencyNo, user.extraphone1, user.extraphone2].filter(Boolean);
    
    for (const phone of phones) {
        await sendShortSMS(phone, shortMessage);
    }
    
    return phones.length;
};

module.exports = { sendShortEmergencySMS };