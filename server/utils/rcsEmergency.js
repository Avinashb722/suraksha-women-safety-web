const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const sendRCSEmergency = async (phoneNumbers, message) => {
    try {
        const data = {
            api_key: 'BSUo8a5qVthEJfxKDI4Nbw3ZPelWcQ1rGRjv60AzYp2mOn7TXgsXgHclJuTUpLd8fCSDtk7GMAmPxBYK',
            sender_id: 'SURAKSHA',
            numbers: phoneNumbers.map(num => `+91${num}`),
            message: message,
            type: 'RCS',
            action_button: {
                text: 'View Location',
                url: `https://maps.google.com/maps?q=${message.match(/Location: ([^\s]+)/)?.[1] || '12.9716,77.5946'}`
            }
        };

        const response = await fetch('https://www.fast2sms.com/dev/api/rcs/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        console.log('RCS Response:', result);
        
        if (result.success) {
            console.log(`✅ RCS sent to ${phoneNumbers.join(', ')} - Cost: ₹${phoneNumbers.length * 0.25}`);
            return true;
        } else {
            console.log(`❌ RCS failed: ${result.message}`);
            return false;
        }
    } catch (error) {
        console.log('❌ RCS error:', error.message);
        return false;
    }
};

const sendRCSEmergencyAlerts = async (user, lat, long) => {
    const message = `🚨 EMERGENCY: ${user.uname} needs help! Location: ${lat},${long}`;
    
    const phones = [user.emergencyNo, user.extraphone1, user.extraphone2].filter(Boolean);
    
    console.log('Sending RCS Emergency Alerts - ₹0.25 per message');
    
    if (phones.length > 0) {
        await sendRCSEmergency(phones, message);
    }
    
    return phones.length;
};

module.exports = { sendRCSEmergencyAlerts };