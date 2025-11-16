const express = require('express');
const router = express.Router();
const { sendEmergencySMS } = require('../utils/freeSmsService');

// Test SMS endpoint
router.post('/test', async (req, res) => {
    try {
        const { phoneNumber, message } = req.body;
        
        if (!phoneNumber) {
            return res.status(400).json({ message: 'Phone number required' });
        }
        
        const testMessage = message || 'Test emergency message from Suraksha app';
        
        const success = await sendEmergencySMS(
            phoneNumber, 
            'Test User', 
            '12.9716', 
            '77.5946', 
            testMessage
        );
        
        if (success) {
            res.json({ message: 'SMS sent successfully', phoneNumber });
        } else {
            res.status(500).json({ message: 'Failed to send SMS' });
        }
        
    } catch (error) {
        console.error('SMS test error:', error);
        res.status(500).json({ message: 'SMS service error', error: error.message });
    }
});

module.exports = router;