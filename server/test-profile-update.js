const axios = require('axios');

async function testProfileUpdate() {
    try {
        // First login to get token
        const loginResponse = await axios.post('http://localhost:5000/api/v1/users/login', {
            email: 'madankumarbaradi@gmail.com',
            password: 'your_password_here' // You'll need to provide the actual password
        });
        
        const token = loginResponse.data.token;
        console.log('Login successful, got token');
        
        // Now try profile update
        const updateResponse = await axios.put('http://localhost:5000/api/v1/users/update', {
            uname: 'madankumar',
            email: 'madankumarbaradi@gmail.com',
            phoneNo: '7676930793',
            address: '',
            pincode: '590002', // Changed pincode
            emergencyMail: 'abhikumbar636@gmail.com',
            emergencyNo: '6361243998',
            extraEmail1: '',
            extraEmail2: '',
            extraPhone1: '',
            extraPhone2: ''
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        console.log('Profile update response:', updateResponse.data);
        
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}

testProfileUpdate();