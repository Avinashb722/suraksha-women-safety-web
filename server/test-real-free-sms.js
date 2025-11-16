const { sendRealFreeSMS } = require('./utils/realFreeSMS');

async function testRealFreeSMS() {
    const testUser = {
        uname: 'Test User',
        emergencyNo: '6361243998',
        extraphone1: null,
        extraphone2: null
    };
    
    console.log('Testing REAL FREE SMS...');
    await sendRealFreeSMS(testUser, '12.9716', '77.5946');
}

testRealFreeSMS();