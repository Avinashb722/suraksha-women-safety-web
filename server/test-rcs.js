const { sendRCSEmergencyAlerts } = require('./utils/rcsEmergency');

async function testRCS() {
    const testUser = {
        uname: 'Abhishek Kumar',
        emergencyNo: '6361243998',
        extraphone1: null,
        extraphone2: null
    };
    
    console.log('Testing RCS Emergency Alerts - ₹0.25 per message...');
    await sendRCSEmergencyAlerts(testUser, '12.9716', '77.5946');
}

testRCS();