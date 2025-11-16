const { sendTrackingEmail, sendSafeArrivalEmail } = require('./utils/email');

const testTrackingEmail = async () => {
    try {
        console.log('Testing tracking email...');
        await sendTrackingEmail(
            ['suraksha7363@gmail.com'], // Test email
            12.9716, 
            77.5946, 
            'Test User', 
            'Test Location, Bangalore'
        );
        console.log('Tracking email sent successfully');
    } catch (error) {
        console.error('Tracking email test failed:', error.message);
    }
};

const testSafeArrivalEmail = async () => {
    try {
        console.log('Testing safe arrival email...');
        await sendSafeArrivalEmail(
            ['suraksha7363@gmail.com'], // Test email
            12.9716, 
            77.5946, 
            'Test User', 
            'Test Location, Bangalore'
        );
        console.log('Safe arrival email sent successfully');
    } catch (error) {
        console.error('Safe arrival email test failed:', error.message);
    }
};

// Run tests
testTrackingEmail();
setTimeout(testSafeArrivalEmail, 2000);