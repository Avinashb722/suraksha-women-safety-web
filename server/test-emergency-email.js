const {User} = require('./models/userModel');
const {sendHelpEmail} = require('./utils/email');
const connectDB = require('./database/db');
require('dotenv').config();

const testEmergencyEmail = async () => {
    try {
        await connectDB(process.env.MONGO_URL);
        
        // Test data
        const testUser = {
            uname: "Test User",
            emergencyMail: "vtucrack96@gmail.com",
            extraEmail1: "abhikumbar636@gmail.com",
            extraEmail2: null
        };
        
        const recipients = [];
        if(testUser.emergencyMail) recipients.push(testUser.emergencyMail);
        if(testUser.extraEmail1) recipients.push(testUser.extraEmail1);
        if(testUser.extraEmail2) recipients.push(testUser.extraEmail2);
        
        console.log('Sending emergency emails to:', recipients);
        
        await sendHelpEmail(recipients, 12.9716, 77.5946, testUser.uname, "560001", "Test Location, Bangalore");
        
        console.log('Emergency emails sent successfully');
        
    } catch (error) {
        console.error('Test failed:', error.message);
    }
    process.exit();
};

testEmergencyEmail();