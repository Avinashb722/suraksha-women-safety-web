const mongoose = require('mongoose');
const { User } = require('./models/userModel');
require('dotenv').config();

async function testUserContacts() {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to database');
        
        // Find all users and check their emergency contacts
        const users = await User.find({});
        console.log(`Found ${users.length} users`);
        
        users.forEach(user => {
            console.log('\n👤 User:', user.uname);
            console.log('📧 Emergency Email:', user.emergencyMail || 'Not set');
            console.log('📱 Emergency Phone:', user.emergencyNo || 'Not set');
            console.log('📱 Extra Phone 1:', user.extraphone1 || 'Not set');
            console.log('📧 Extra Email 1:', user.extraEmail1 || 'Not set');
            
            if (!user.emergencyMail && !user.emergencyNo) {
                console.log('⚠️  No emergency contacts configured!');
            }
        });
        
        mongoose.disconnect();
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testUserContacts();