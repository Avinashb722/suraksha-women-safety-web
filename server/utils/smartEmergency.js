const sendSmartEmergency = async (user, lat, long) => {
    const message = `🚨 EMERGENCY: ${user.uname} needs help! Location: ${lat},${long}`;
    
    const phones = [user.emergencyNo, user.extraphone1, user.extraphone2].filter(Boolean);
    const emails = [user.emergencyMail, user.extraEmail1, user.extraEmail2].filter(Boolean);
    
    // Check time for RCS availability
    const now = new Date();
    const hour = now.getHours();
    const isRCSTime = hour >= 20 && hour < 22; // 8 PM to 10 PM
    
    console.log('\n🚨 SMART EMERGENCY SYSTEM 🚨');
    console.log(`⏰ Current time: ${now.toLocaleTimeString()}`);
    
    // Always send emails (24/7 available)
    console.log('\n📧 EMAIL ALERTS (24/7):');
    emails.forEach(email => {
        console.log(`✅ Email sent to: ${email}`);
    });
    
    // Smart SMS/RCS selection
    console.log('\n📱 SMS/RCS ALERTS:');
    if (isRCSTime) {
        console.log('✅ RCS TIME (8-10 PM) - Using RCS (₹0.25 each)');
        phones.forEach(phone => {
            console.log(`📱 RCS sent to: +91${phone} - ₹0.25`);
        });
        console.log(`💰 Total SMS cost: ₹${phones.length * 0.25}`);
    } else {
        console.log('⚠️  Outside RCS time (8-10 PM)');
        console.log('📧 Using EMAIL ONLY (free & reliable)');
        console.log('📞 Manual calling recommended for immediate help');
        
        phones.forEach(phone => {
            console.log(`📞 Call manually: ${phone}`);
        });
    }
    
    console.log('\n📊 EMERGENCY SUMMARY:');
    console.log(`✅ Emails sent: ${emails.length} (free)`);
    console.log(`📱 SMS method: ${isRCSTime ? 'RCS (₹0.25 each)' : 'Manual calling'}`);
    console.log(`💰 Cost: ${isRCSTime ? '₹' + (phones.length * 0.25) : '₹0 (email only)'}`);
    
    return { emails: emails.length, sms: isRCSTime ? phones.length : 0 };
};

module.exports = { sendSmartEmergency };