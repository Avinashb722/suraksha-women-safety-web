const { sendTrackingStartEmail } = require('./utils/email');

const testDirectEmail = async () => {
    try {
        console.log('Testing direct tracking start email...');
        await sendTrackingStartEmail(['suraksha7363@gmail.com'], 'Test User');
        console.log('Direct email sent successfully');
    } catch (error) {
        console.error('Direct email failed:', error);
    }
};

testDirectEmail();