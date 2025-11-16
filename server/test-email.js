const nodemailer = require('nodemailer');
require('dotenv').config();

const testEmail = async () => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: 'vtucrack96@gmail.com',
            subject: 'Test Emergency Email',
            html: '<h1>Emergency Test</h1><p>This is a test emergency email.</p>'
        });

        console.log('Test email sent successfully');
    } catch (error) {
        console.error('Email test failed:', error.message);
    }
};

testEmail();