const sendWhatsAppEmergency = async (user, lat, long) => {
    const message = `🚨 EMERGENCY: ${user.uname} needs help! Location: ${lat}, ${long} Maps: https://maps.google.com/maps?q=${lat},${long}`;
    
    const phones = [user.emergencyNo, user.extraphone1, user.extraphone2].filter(Boolean);
    
    console.log('\n🚨 EMERGENCY WHATSAPP ALERTS 🚨');
    console.log('Message:', message);
    
    phones.forEach(phone => {
        const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        console.log(`\n📱 WhatsApp link for ${phone}:`);
        console.log(whatsappUrl);
        console.log('Click this link to send WhatsApp message manually');
    });
    
    // Create emergency file with WhatsApp links
    const fs = require('fs');
    const path = require('path');
    
    const emergencyFile = path.join(__dirname, '../whatsapp-emergency.html');
    let html = `
<!DOCTYPE html>
<html>
<head>
    <title>🚨 Emergency WhatsApp Alerts</title>
    <style>
        body { font-family: Arial; padding: 20px; background: #f0f0f0; }
        .alert { background: #ff4444; color: white; padding: 15px; border-radius: 5px; margin: 10px 0; }
        .whatsapp-btn { 
            background: #25D366; color: white; padding: 10px 20px; 
            text-decoration: none; border-radius: 5px; display: inline-block; margin: 5px;
        }
        .message { background: white; padding: 15px; border-radius: 5px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="alert">
        <h2>🚨 EMERGENCY ALERT</h2>
        <p>Time: ${new Date().toLocaleString()}</p>
        <p>User: ${user.uname}</p>
    </div>
    
    <div class="message">
        <h3>Emergency Message:</h3>
        <p>${message}</p>
    </div>
    
    <h3>📱 Send WhatsApp Messages:</h3>
`;

    phones.forEach(phone => {
        const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        html += `<a href="${whatsappUrl}" target="_blank" class="whatsapp-btn">Send to ${phone}</a><br>`;
    });
    
    html += `
    <p><strong>Instructions:</strong> Click the buttons above to open WhatsApp and send emergency messages.</p>
</body>
</html>`;
    
    fs.writeFileSync(emergencyFile, html);
    console.log(`\n✅ Emergency WhatsApp page created: ${emergencyFile}`);
    console.log('Open this file in browser to send WhatsApp messages');
    
    return phones.length;
};

module.exports = { sendWhatsAppEmergency };