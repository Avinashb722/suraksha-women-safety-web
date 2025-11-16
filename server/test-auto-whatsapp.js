const { sendAutoWhatsApp } = require('./utils/autoWhatsApp');

async function testAutoWhatsApp() {
    const testUser = {
        uname: 'Test User',
        emergencyNo: '6361243998',
        extraphone1: null,
        extraphone2: null
    };
    
    console.log('Testing AUTO WhatsApp...');
    await sendAutoWhatsApp(testUser, '12.9716', '77.5946');
}

testAutoWhatsApp();