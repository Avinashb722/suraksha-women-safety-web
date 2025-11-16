const { sendQuickSMSEmergency } = require('./utils/quickSMS5');

async function testQuickSMS5() {
    const testUser = {
        uname: 'Abhishek Kumar',
        emergencyNo: '6361243998',
        extraphone1: null,
        extraphone2: null
    };
    
    console.log('Testing Quick SMS at ₹5 per message...');
    await sendQuickSMSEmergency(testUser, '12.9716', '77.5946');
}

testQuickSMS5();