const { sendEmergencyMessages } = require('./utils/simpleEmergency');
const { sendWorkingFast2SMS } = require('./utils/workingFast2SMS');

async function testCompleteEmergency() {
    const testUser = {
        uname: 'Abhishek Kumar',
        emergencyMail: 'abhikumbar636@gmail.com',
        emergencyNo: '6361243998',
        extraEmail1: 'backup@example.com',
        extraphone1: null,
        extraEmail2: null,
        extraphone2: null
    };
    
    console.log('🚨 TESTING COMPLETE EMERGENCY SYSTEM 🚨\n');
    
    try {
        console.log('📧 Sending emergency emails...');
        await sendEmergencyMessages(testUser, '12.9716', '77.5946');
        
        console.log('\n📱 Sending emergency SMS...');
        await sendWorkingFast2SMS(testUser, '12.9716', '77.5946');
        
        console.log('\n✅ COMPLETE EMERGENCY SYSTEM WORKING!');
        console.log('Both email and SMS alerts sent successfully! 🎉');
        
    } catch (error) {
        console.error('❌ Emergency system error:', error);
    }
}

testCompleteEmergency();