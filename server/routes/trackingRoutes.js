const express = require('express');
const router = express.Router();
const { sendTrackingStartEmail, sendTrackingEmail, sendSafeArrivalEmail } = require('../utils/email');

let activeTracking = new Map();

// Test route
router.get('/test', (req, res) => {
    res.json({ success: true, message: 'Tracking routes working' });
});

router.post('/start', async (req, res) => {
    try {
        const { userId, emergencyContacts, username } = req.body;
        console.log('Starting tracking for:', { userId, emergencyContacts, username });
        
        if (!emergencyContacts || emergencyContacts.length === 0) {
            return res.status(400).json({ success: false, message: 'No emergency contacts provided' });
        }
        
        if (activeTracking.has(userId)) {
            clearInterval(activeTracking.get(userId).intervalId);
        }
        
        activeTracking.set(userId, {
            emergencyContacts,
            username,
            startTime: new Date()
        });
        
        // Send tracking start email
        await sendTrackingStartEmail(emergencyContacts, username);
        
        console.log('Tracking started successfully for user:', userId);
        res.json({ success: true, message: 'Tracking started successfully' });
    } catch (error) {
        console.error('Error starting tracking:', error);
        res.status(500).json({ success: false, message: 'Failed to start tracking' });
    }
});

router.post('/update-location', async (req, res) => {
    try {
        const { userId, lat, long, formatted_address } = req.body;
        console.log('Location update request:', { userId, lat, long, formatted_address });
        
        const tracking = activeTracking.get(userId);
        if (!tracking) {
            console.log('No active tracking found for user:', userId);
            return res.status(404).json({ success: false, message: 'No active tracking found' });
        }
        
        console.log('Sending tracking email to:', tracking.emergencyContacts);
        await sendTrackingEmail(
            tracking.emergencyContacts,
            lat,
            long,
            tracking.username,
            formatted_address
        );
        
        console.log('Tracking email sent successfully');
        res.json({ success: true, message: 'Location update sent' });
    } catch (error) {
        console.error('Error updating location:', error);
        res.status(500).json({ success: false, message: 'Failed to send location update', error: error.message });
    }
});

router.post('/safe-arrival', async (req, res) => {
    try {
        const { userId, lat, long, formatted_address } = req.body;
        
        const tracking = activeTracking.get(userId);
        if (!tracking) {
            return res.status(404).json({ success: false, message: 'No active tracking found' });
        }
        
        await sendSafeArrivalEmail(
            tracking.emergencyContacts,
            lat,
            long,
            tracking.username,
            formatted_address
        );
        
        activeTracking.delete(userId);
        
        res.json({ success: true, message: 'Safe arrival notification sent' });
    } catch (error) {
        console.error('Error sending safe arrival:', error);
        res.status(500).json({ success: false, message: 'Failed to send safe arrival notification' });
    }
});

router.post('/stop', (req, res) => {
    try {
        const { userId } = req.body;
        
        if (activeTracking.has(userId)) {
            activeTracking.delete(userId);
        }
        
        res.json({ success: true, message: 'Tracking stopped' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to stop tracking' });
    }
});

console.log('Tracking routes loaded');
module.exports = router;