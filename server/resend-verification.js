const {User} = require('./models/userModel');
const {generateverificationToken, sendVerificationEmail} = require('./utils/email');
const connectDB = require('./database/db');
require('dotenv').config();

const resendVerification = async (email) => {
    try {
        await connectDB(process.env.MONGO_URL);
        
        const user = await User.findOne({email: email});
        if (!user) {
            console.log('User not found');
            return;
        }
        
        if (user.isVerified) {
            console.log('User already verified');
            return;
        }
        
        const newToken = generateverificationToken(email);
        user.verificationToken = newToken;
        await user.save();
        
        await sendVerificationEmail(email, newToken);
        console.log('New verification email sent');
        
    } catch (error) {
        console.error('Error:', error);
    }
};

// Usage: node resend-verification.js
resendVerification('vtucrack96@gmail.com');