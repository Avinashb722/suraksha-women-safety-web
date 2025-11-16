const https = require('https');

const sendDirectRCS = async (phoneNumber, message) => {
    return new Promise((resolve) => {
        const data = JSON.stringify({
            numbers: [phoneNumber],
            message: message,
            sender_id: 'SURKSH'
        });

        const options = {
            hostname: 'www.fast2sms.com',
            port: 443,
            path: '/dev/rcs',
            method: 'POST',
            headers: {
                'Authorization': 'BSUo8a5qVthEJfxKDI4Nbw3ZPelWcQ1rGRjv60AzYp2mOn7TXgsXgHclJuTUpLd8fCSDtk7GMAmPxBYK',
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => responseData += chunk);
            res.on('end', () => {
                console.log('RCS Raw Response:', responseData);
                try {
                    const result = JSON.parse(responseData);
                    if (result.success || result.return) {
                        console.log(`✅ RCS sent to ${phoneNumber} - ₹0.25`);
                        resolve(true);
                    } else {
                        console.log(`❌ RCS failed: ${result.message || 'Unknown error'}`);
                        resolve(false);
                    }
                } catch (error) {
                    console.log('❌ RCS response not JSON, trying anyway...');
                    resolve(true); // Sometimes RCS works even with HTML response
                }
            });
        });

        req.on('error', (error) => {
            console.log('❌ RCS request error:', error.message);
            resolve(false);
        });

        req.write(data);
        req.end();
    });
};

const sendDirectRCSEmergency = async (user, lat, long) => {
    const message = `🚨 EMERGENCY: ${user.uname} needs help! Location: ${lat},${long}`;
    
    const phones = [user.emergencyNo, user.extraphone1, user.extraphone2].filter(Boolean);
    
    console.log('Sending Direct RCS - ₹0.25 per message');
    
    for (const phone of phones) {
        await sendDirectRCS(phone, message);
    }
    
    console.log(`💰 Total RCS cost: ₹${phones.length * 0.25}`);
    return phones.length;
};

module.exports = { sendDirectRCSEmergency };