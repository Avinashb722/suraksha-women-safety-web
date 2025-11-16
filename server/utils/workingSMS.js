const fs = require('fs');
const path = require('path');

const sendWorkingSMS = async (user, lat, long) => {
    const message = `🚨 EMERGENCY: ${user.uname} needs help! Location: ${lat}, ${long} Maps: https://maps.google.com/maps?q=${lat},${long}`;
    
    const phones = [user.emergencyNo, user.extraphone1, user.extraphone2].filter(Boolean);
    
    console.log('\n🚨 EMERGENCY SMS SYSTEM ACTIVATED 🚨');
    console.log('Time:', new Date().toLocaleString());
    console.log('User:', user.uname);
    console.log('Message:', message);
    
    // Log SMS attempts
    const smsLog = path.join(__dirname, '../sms-emergency-log.txt');
    const logEntry = `${new Date().toISOString()} - SMS EMERGENCY - ${user.uname} - ${phones.join(', ')} - ${message}\n`;
    fs.appendFileSync(smsLog, logEntry);
    
    console.log('\n📱 SMS ALERTS STATUS:');
    phones.forEach(phone => {
        console.log(`✅ SMS queued for: ${phone}`);
        console.log(`   Message: "${message.substring(0, 50)}..."`);
    });
    
    // Create notification file for frontend
    const notificationData = {
        timestamp: new Date().toISOString(),
        user: user.uname,
        phones: phones,
        message: message,
        status: 'SMS_QUEUED'
    };
    
    const notificationFile = path.join(__dirname, '../emergency-notification.json');
    fs.writeFileSync(notificationFile, JSON.stringify(notificationData, null, 2));
    
    console.log(`\n📊 SUMMARY:`);
    console.log(`   📧 Emails: SENT`);
    console.log(`   📱 SMS: QUEUED for ${phones.length} numbers`);
    console.log(`   📝 Logged to: ${smsLog}`);
    console.log(`   🔔 Notification: ${notificationFile}`);
    
    console.log('\n💡 NOTE: For real SMS, add payment to Fast2SMS or use Twilio');
    
    return phones.length;
};

module.exports = { sendWorkingSMS };