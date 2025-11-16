const { sendWorkingSMS } = require('./utils/workingSMS');

async function testWorkingSMS() {
    const testUser = {
        uname: 'Abhishek Kumar',
        emergencyNo: '6361243998',
        extraphone1: '9876543210',
        extraphone2: null
    };
    
    console.log('Testing WORKING SMS system...');
    await sendWorkingSMS(testUser, '12.9716', '77.5946');
}

testWorkingSMS();