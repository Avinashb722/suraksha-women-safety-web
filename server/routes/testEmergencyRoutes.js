const express = require('express');
const router = express.Router();
const { sendEmergencyMessages } = require('../utils/simpleEmergency');

// Test emergency messages
router.post('/test', async (req, res) => {
    try {
        const { email, phone, username } = req.body;
        
        if (!email && !phone) {
            return res.status(400).json({ message: 'Email or phone required' });
        }
        
        const testUser = {
            uname: username || 'Test User',
            emergencyMail: email,
            emergencyNo: phone,
            extraEmail1: null,
            extraphone1: null,
            extraEmail2: null,
            extraphone2: null
        };
        
        await sendEmergencyMessages(testUser, '12.9716', '77.5946');
        
        res.json({ 
            message: 'Emergency messages sent successfully',
            sent: {
                email: !!email,
                sms: !!phone
            }
        });
        
    } catch (error) {
        console.error('Test emergency error:', error);
        res.status(500).json({ message: 'Failed to send messages', error: error.message });
    }
});

module.exports = router;