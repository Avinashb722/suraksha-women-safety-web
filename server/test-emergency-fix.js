const axios = require('axios');
require('dotenv').config();

const testEmergencyService = async () => {
    console.log('Testing Emergency Service...\n');
    
    // Test data
    const testPayload = {
        userId: "507f1f77bcf86cd799439011", // Mock user ID
        lat: 15.3647,  // Belagavi coordinates
        long: 74.7314
    };
    
    try {
        console.log('Sending emergency request...');
        console.log('Payload:', testPayload);
        
        const response = await axios.post(
            'http://localhost:5001/api/v1/emergency/emergencyPressed',
            testPayload,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 10000
            }
        );
        
        console.log('\n✅ SUCCESS!');
        console.log('Status:', response.status);
        console.log('Response:', response.data);
        
    } catch (error) {
        console.log('\n❌ FAILED!');
        
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Error:', error.response.data);
        } else if (error.request) {
            console.log('Network Error - Server not responding');
            console.log('Make sure server is running on port 5001');
        } else {
            console.log('Error:', error.message);
        }
    }
};

// Test database connection
const testDatabase = async () => {
    try {
        const mongoose = require('mongoose');
        await mongoose.connect(process.env.MONGO_URL);
        console.log('✅ Database connection successful');
        mongoose.disconnect();
    } catch (error) {
        console.log('❌ Database connection failed:', error.message);
    }
};

const runTests = async () => {
    console.log('=== EMERGENCY SERVICE DIAGNOSTICS ===\n');
    
    // Test 1: Database
    console.log('1. Testing Database Connection...');
    await testDatabase();
    
    console.log('\n2. Testing Emergency Endpoint...');
    await testEmergencyService();
    
    console.log('\n=== TEST COMPLETE ===');
};

runTests();