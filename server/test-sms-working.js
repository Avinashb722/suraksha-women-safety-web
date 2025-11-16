const { sendWorkingFast2SMS } = require('./utils/workingFast2SMS');

async function testSMSWorking() {
    const testUser = {
        uname: 'Abhishek Kumar',
        emergencyMail: 'abhikumbar636@gmail.com',
        emergencyNo: '6361243998',
        extraphone1: '9876543210',
        extraEmail2: null,
        extraphone2: null
    };
    
    console.log('🚨 TESTING SMS EMERGENCY SYSTEM 🚨\n');
    
    try {
        console.log('📱 Sending emergency SMS to all contacts...');
        await sendWorkingFast2SMS(testUser, '12.9716', '77.5946');
        
        console.log('\n🎉 SMS EMERGENCY SYSTEM WORKING!');
        console.log('Check your phone for emergency SMS! 📱');
        
    } catch (error) {
        console.error('❌ SMS system error:', error);
    }
}

testSMSWorking();