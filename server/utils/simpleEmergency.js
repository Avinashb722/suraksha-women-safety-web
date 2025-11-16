const nodemailer = require('nodemailer');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config();

// Simple email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

// Simple SMS using Fast2SMS
const sendSimpleSMS = async (phoneNumber, message) => {
    try {
        const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
            method: 'POST',
            headers: {
                'authorization': process.env.FAST2SMS_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                route: 'q',
                message: message,
                language: 'english',
                flash: 0,
                numbers: phoneNumber
            })
        });
        
        const result = await response.json();
        console.log('SMS Result:', result);
        return result.return;
    } catch (error) {
        console.error('SMS Error:', error);
        return false;
    }
};

// Simple email sender
const sendSimpleEmail = async (email, subject, message) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: subject,
            text: message,
            html: `<p>${message}</p>`
        });
        console.log('Email sent to:', email);
        return true;
    } catch (error) {
        console.error('Email Error:', error);
        return false;
    }
};

// Send emergency messages
const sendEmergencyMessages = async (user, lat, long) => {
    const message = `🚨 EMERGENCY: ${user.uname} needs help! Location: ${lat}, ${long} Maps: https://maps.google.com/maps?q=${lat},${long}`;
    
    console.log('Sending emergency messages for:', user.uname);
    
    // Send emails
    const emails = [user.emergencyMail, user.extraEmail1, user.extraEmail2].filter(Boolean);
    for (const email of emails) {
        await sendSimpleEmail(email, `${user.uname} NEEDS HELP!!!`, message);
    }
    
    // Send SMS
    const phones = [user.emergencyNo, user.extraphone1, user.extraphone2].filter(Boolean);
    for (const phone of phones) {
        await sendSimpleSMS(phone.toString(), message);
    }
    
    console.log(`Messages sent to ${emails.length} emails and ${phones.length} phones`);
};

module.exports = { sendEmergencyMessages };