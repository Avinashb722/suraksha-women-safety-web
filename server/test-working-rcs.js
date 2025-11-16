const { sendWorkingRCS } = require('./utils/workingRCS');

async function testWorkingRCS() {
    const testUser = {
        uname: 'Abhishek Kumar',
        emergencyNo: '6361243998',
        extraphone1: '9876543210',
        extraphone2: null
    };
    
    console.log('Testing RCS Emergency System...');
    await sendWorkingRCS(testUser, '12.9716', '77.5946');
}

testWorkingRCS();