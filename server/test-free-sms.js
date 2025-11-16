const { sendFreeSMSEmergency } = require('./utils/freeSMSReal');

async function testFreeSMS() {
    const testUser = {
        uname: 'Test User',
        emergencyNo: '6361243998',
        extraphone1: null,
        extraphone2: null
    };
    
    console.log('Testing FREE SMS with TextBelt...');
    await sendFreeSMSEmergency(testUser, '12.9716', '77.5946');
}

testFreeSMS();