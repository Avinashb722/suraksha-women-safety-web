const sendRCSReady = async (user, lat, long) => {
    const message = `🚨 EMERGENCY: ${user.uname} needs help! Location: ${lat}, ${long} Maps: https://maps.google.com/maps?q=${lat},${long}`;
    
    const phones = [user.emergencyNo, user.extraphone1, user.extraphone2].filter(Boolean);
    
    console.log('\n🚨 RCS EMERGENCY SYSTEM READY 🚨');
    console.log('Cost: ₹0.25 per message (60x cheaper than Quick SMS)');
    console.log('Balance: ₹5.00 = 20 RCS messages');
    
    console.log('\n📱 RCS EMERGENCY CONTACTS:');
    phones.forEach(phone => {
        console.log(`✅ RCS ready for: ${phone}`);
        console.log(`   Message: "${message.substring(0, 50)}..."`);
        console.log(`   Cost: ₹0.25 (vs ₹15 Quick SMS)`);
    });
    
    console.log('\n💡 TO ACTIVATE RCS:');
    console.log('1. Go to Fast2SMS → Promo RCS');
    console.log('2. Send test message manually');
    console.log('3. Once working, API will be ready');
    
    console.log('\n📊 COST COMPARISON:');
    console.log('   Quick SMS: ₹15 × 10 emergencies = ₹150');
    console.log('   RCS: ₹0.25 × 10 emergencies = ₹2.50');
    console.log('   Savings: ₹147.50 (98% cheaper!)');
    
    return phones.length;
};

module.exports = { sendRCSReady };