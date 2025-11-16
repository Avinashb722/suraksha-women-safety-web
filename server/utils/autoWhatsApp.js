const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const sendAutoWhatsApp = async (user, lat, long) => {
    const message = `🚨 EMERGENCY: ${user.uname} needs help! Location: ${lat}, ${long} Maps: https://maps.google.com/maps?q=${lat},${long}`;
    
    const phones = [user.emergencyNo, user.extraphone1, user.extraphone2].filter(Boolean);
    
    console.log('🚨 AUTO-OPENING WHATSAPP MESSAGES...');
    
    // Auto-open WhatsApp links
    for (const phone of phones) {
        const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        console.log(`📱 Opening WhatsApp for ${phone}...`);
        
        // Auto-open in browser
        exec(`start "" "${whatsappUrl}"`, (error) => {
            if (error) {
                console.log(`Manual link for ${phone}: ${whatsappUrl}`);
            } else {
                console.log(`✅ WhatsApp opened for ${phone}`);
            }
        });
    }
    
    return phones.length;
};

module.exports = { sendAutoWhatsApp };