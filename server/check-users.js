const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { User } = require('./models/userModel');
require('dotenv').config();

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to MongoDB');
        
        const users = await User.find({});
        console.log(`Found ${users.length} users in database:`);
        
        users.forEach(user => {
            console.log(`- ${user.email} (verified: ${user.isVerified})`);
        });
        
        if (users.length === 0) {
            console.log('\nNo users found. Creating test user...');
            const hashedPassword = await bcrypt.hash('test123', 10);
            
            const testUser = await User.create({
                uname: 'Test User',
                email: 'test@example.com',
                password: hashedPassword,
                phoneNo: '1234567890',
                emergencyNo: 9876543210,
                emergencyMail: 'emergency@example.com',
                pinCode: 123456,
                isVerified: true
            });
            
            console.log('Test user created:');
            console.log('Email: test@example.com');
            console.log('Password: test123');
        }
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        mongoose.disconnect();
    }
};

checkUsers();