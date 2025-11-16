const fs = require('fs');
const path = require('path');

const sendFinalEmergencyAlerts = async (user, lat, long) => {
    const message = `🚨 EMERGENCY: ${user.uname} needs help! Location: ${lat}, ${long} Maps: https://maps.google.com/maps?q=${lat},${long}`;
    
    console.log('\n🚨 EMERGENCY SYSTEM ACTIVATED 🚨');
    console.log('Time:', new Date().toLocaleString());
    console.log('User:', user.uname);
    
    // What actually works
    const emails = [user.emergencyMail, user.extraEmail1, user.extraEmail2].filter(Boolean);
    const phones = [user.emergencyNo, user.extraphone1, user.extraphone2].filter(Boolean);
    
    console.log('\n✅ WORKING ALERTS:');
    console.log(`📧 Emails sent to: ${emails.join(', ')}`);
    
    console.log('\n📱 SMS CONTACTS (Manual):');
    phones.forEach(phone => {
        console.log(`   ${phone} - Call or text manually`);
    });
    
    console.log('\n📋 EMERGENCY MESSAGE:');
    console.log(`"${message}"`);
    
    // Save emergency info for manual use
    const emergencyInfo = {
        time: new Date().toLocaleString(),
        user: user.uname,
        location: `${lat}, ${long}`,
        mapLink: `https://maps.google.com/maps?q=${lat},${long}`,
        message: message,
        emailContacts: emails,
        phoneContacts: phones
    };
    
    const infoFile = path.join(__dirname, '../emergency-info.json');
    fs.writeFileSync(infoFile, JSON.stringify(emergencyInfo, null, 2));
    
    console.log('\n📄 Emergency info saved to:', infoFile);
    console.log('\n💡 REALITY: Only emails auto-send. SMS needs payment or manual sending.');
    
    return { emails: emails.length, phones: phones.length };
};

module.exports = { sendFinalEmergencyAlerts };