const { sendWhatsAppEmergency } = require('./utils/whatsappEmergency');

async function testWhatsApp() {
    const testUser = {
        uname: 'Test User',
        emergencyNo: '6361243998',
        extraphone1: '9876543210',
        extraphone2: null
    };
    
    console.log('Creating WhatsApp emergency alerts...');
    await sendWhatsAppEmergency(testUser, '12.9716', '77.5946');
}

testWhatsApp();