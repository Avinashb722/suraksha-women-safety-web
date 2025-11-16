const mongoose = require('mongoose');
const { User } = require('./models/userModel');
require('dotenv').config();

const verifyUser = async (email) => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to MongoDB');
        
        const user = await User.findOne({ email: email });
        if (!user) {
            console.log(`User with email ${email} not found`);
            return;
        }
        
        if (user.isVerified) {
            console.log(`User ${email} is already verified`);
        } else {
            user.isVerified = true;
            user.verificationToken = null;
            await user.save();
            console.log(`User ${email} has been manually verified`);
        }
        
        console.log(`Verification link: http://localhost:5001/api/v1/users/emailverify/${user.verificationToken || 'already-verified'}`);
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        mongoose.disconnect();
    }
};

// Get email from command line argument or use default
const email = process.argv[2] || 'test@example.com';
verifyUser(email);