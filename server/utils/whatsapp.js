// WhatsApp Web API (completely free)
const sendWhatsAppMessage = async (phoneNumber, username, lat, long, address) => {
    try {
        const message = `🚨 EMERGENCY ALERT 🚨\n\n${username} needs immediate help!\n\nLocation: ${address}\nGoogle Maps: https://maps.google.com/maps?q=${lat},${long}\n\nPlease contact them or call emergency services!`;
        
        // Create WhatsApp Web URL
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        
        console.log('WhatsApp URL generated:', whatsappUrl);
        
        // In a real app, you could:
        // 1. Open this URL automatically
        // 2. Use WhatsApp Business API
        // 3. Use browser automation to send
        
        return { success: true, url: whatsappUrl };
        
    } catch (error) {
        console.error('WhatsApp message failed:', error.message);
        throw error;
    }
};

module.exports = { sendWhatsAppMessage };