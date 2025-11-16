const { sendSmartEmergency } = require('./utils/smartEmergency');

async function testSmartEmergency() {
    const testUser = {
        uname: 'Abhishek Kumar',
        emergencyMail: 'abhikumbar636@gmail.com',
        emergencyNo: '6361243998',
        extraEmail1: 'backup@example.com',
        extraphone1: '9876543210',
        extraEmail2: null,
        extraphone2: null
    };
    
    console.log('Testing Smart Emergency System...');
    await sendSmartEmergency(testUser, '12.9716', '77.5946');
}

testSmartEmergency();