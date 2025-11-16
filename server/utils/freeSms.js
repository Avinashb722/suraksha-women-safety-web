// Free SMS alternatives (India)

// Option 1: Fast2SMS (Free tier: 50 SMS/day)
const sendFast2SMS = async (phoneNumber, message) => {
    const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
            'authorization': 'YOUR_FAST2SMS_API_KEY',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            route: 'q',
            message: message,
            language: 'english',
            flash: 0,
            numbers: phoneNumber
        })
    });
    return response.json();
};

// Option 2: TextLocal (Free tier: 10 SMS)
const sendTextLocal = async (phoneNumber, message) => {
    const params = new URLSearchParams({
        apikey: 'YOUR_TEXTLOCAL_API_KEY',
        numbers: phoneNumber,
        message: message,
        sender: 'TXTLCL'
    });
    
    const response = await fetch('https://api.textlocal.in/send/', {
        method: 'POST',
        body: params
    });
    return response.json();
};

module.exports = { sendFast2SMS, sendTextLocal };