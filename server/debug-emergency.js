const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// Simple test emergency endpoint
app.post('/api/v1/emergency/emergencyPressed', (req, res) => {
    console.log('Emergency request received:', req.body);
    
    const { userId, lat, long } = req.body;
    
    if (!userId) {
        return res.status(400).json({ message: "userId is required" });
    }
    
    if (!lat || !long) {
        return res.status(400).json({ message: "lat and long are required" });
    }
    
    // Simple success response
    res.status(200).json({ 
        message: "Emergency processed successfully",
        data: { userId, lat, long }
    });
});

app.listen(5002, () => {
    console.log('Debug server running on port 5002');
    console.log('Test with: POST http://localhost:5002/api/v1/emergency/emergencyPressed');
});