const https = require('https');

const sendQuickSMS5 = async (phoneNumber, message) => {
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
                    console.log('Quick SMS Response:', result);
                    if (result.return) {
                        console.log(`✅ Quick SMS sent to ${phoneNumber} - Cost: ₹5.00`);
                        resolve(true);
                    } else {
                        console.log(`❌ Quick SMS failed: ${result.message}`);
                        resolve(false);
                    }
                } catch (error) {
                    console.log('❌ Quick SMS parse error:', error);
                    resolve(false);
                }
            });
        });

        req.on('error', (error) => {
            console.log('❌ Quick SMS request error:', error);
            resolve(false);
        });

        req.write(data);
        req.end();
    });
};

const sendQuickSMSEmergency = async (user, lat, long) => {
    const message = `🚨 EMERGENCY: ${user.uname} needs help! Location: ${lat}, ${long} Maps: https://maps.google.com/maps?q=${lat},${long}`;
    
    const phones = [user.emergencyNo, user.extraphone1, user.extraphone2].filter(Boolean);
    
    console.log('\n🚨 QUICK SMS EMERGENCY (24/7) 🚨');
    console.log('✅ Cost: ₹5.00 per SMS (updated price)');
    console.log('✅ Available 24/7 (no time restrictions)');
    console.log('✅ Works on DND + Non-DND numbers');
    
    for (const phone of phones) {
        await sendQuickSMS5(phone, message);
    }
    
    console.log(`\n💰 Total cost: ₹${phones.length * 5} for ${phones.length} SMS`);
    console.log(`📱 Balance after: ₹${5 - (phones.length * 5)} remaining`);
    
    return phones.length;
};

module.exports = { sendQuickSMSEmergency };