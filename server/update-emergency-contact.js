const mongoose = require('mongoose');
const { User } = require('./models/userModel');
require('dotenv').config();

async function updateEmergencyContact() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        
        const result = await User.updateOne(
            { email: 'madankumarbaradi@gmail.com' },
            { emergencyNo: '6361243998' }
        );
        
        console.log('Update result:', result);
        
        const user = await User.findOne({ email: 'madankumarbaradi@gmail.com' });
        console.log('Updated user emergency number:', user.emergencyNo);
        
        mongoose.disconnect();
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

updateEmergencyContact();