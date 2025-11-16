const { sendWorkingFast2SMS } = require('./utils/workingFast2SMS');

async function testWorkingFast2SMS() {
    const testUser = {
        uname: 'Test User',
        emergencyNo: '6361243998',
        extraphone1: null,
        extraphone2: null
    };
    
    console.log('Testing with your Fast2SMS API key...');
    await sendWorkingFast2SMS(testUser, '12.9716', '77.5946');
}

testWorkingFast2SMS();