const { sendEmergencySMSOnly } = require('./utils/simpleSMS');

async function testSMS() {
    const testUser = {
        uname: 'Test User',
        emergencyNo: '6361243998',
        extraphone1: null,
        extraphone2: null
    };
    
    console.log('Testing SMS with Fast2SMS...');
    await sendEmergencySMSOnly(testUser, '12.9716', '77.5946');
}

testSMS();