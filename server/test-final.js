const { sendFinalEmergencyAlerts } = require('./utils/finalEmergency');

async function testFinal() {
    const testUser = {
        uname: 'Abhishek Kumar',
        emergencyMail: 'abhikumbar636@gmail.com',
        emergencyNo: '6361243998',
        extraEmail1: 'backup@example.com',
        extraphone1: '9876543210',
        extraEmail2: null,
        extraphone2: null
    };
    
    await sendFinalEmergencyAlerts(testUser, '12.9716', '77.5946');
}

testFinal();