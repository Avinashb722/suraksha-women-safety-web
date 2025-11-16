const { sendDirectRCSEmergency } = require('./utils/directRCS');

async function testDirectRCS() {
    const testUser = {
        uname: 'Abhishek Kumar',
        emergencyNo: '6361243998',
        extraphone1: null,
        extraphone2: null
    };
    
    console.log('Testing Direct RCS at ₹0.25 per message...');
    await sendDirectRCSEmergency(testUser, '12.9716', '77.5946');
}

testDirectRCS();