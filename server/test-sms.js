const {sendFast2SMS} = require('./utils/fast2sms');

const testSMS = async () => {
    try {
        await sendFast2SMS('9876543210', 'Test User', 12.9716, 77.5946, 'Test Location, Bangalore');
        console.log('Test SMS sent successfully');
    } catch (error) {
        console.error('SMS test failed:', error.message);
    }
};

testSMS();