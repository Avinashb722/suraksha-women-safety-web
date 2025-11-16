const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');
require('dotenv').config();
const { gmailContent,successFullVerification,mapLocation,mapLocationNearby,trackingStartTemplate,trackingLocationTemplate,safeArrivalTemplate } = require('./emailTemplate')
const secret_key = process.env.ACCESS_TOKEN_SECRET;

const generateverificationToken = (email) => {
    return jwt.sign({ email: email }, secret_key, { expiresIn: '1d' })
}

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    pool: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    }
});

const sendVerificationEmail = async (recipientEmail, verificationToken) => {
    try {
        const emailcontent = gmailContent(verificationToken);

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: recipientEmail,
            subject: 'Email Verification',
            html: emailcontent
        })

        console.log("Verification email has been sent");

    } catch (error) {
        console.error('Error sending verification email:', error);
    }
}

const sendHelpEmail = async(recipientEmails,lat,long,username,pincode,formatted_address) => {
    try {
        const emailcontent = mapLocation(lat,long,username,pincode,formatted_address);
        const recipients = Array.isArray(recipientEmails) ? recipientEmails.join(',') : recipientEmails;

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: recipients,
            subject: `${username} NEEDS HELP!!!`,
            html: emailcontent
        });

        console.log("Emergency email sent successfully");

    } catch (error) {
        console.error('Error sending emergency email:', error);
        throw error;
    }
}

const sendHelpEmailContacts = async(recipientEmails,lat,long,username,pincode,formatted_address) => {
    try {
        const emailcontent = mapLocationNearby(lat,long,username,pincode,formatted_address);
        const recipients = Array.isArray(recipientEmails) ? recipientEmails.join(',') : recipientEmails;

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: recipients,
            subject: `${username} NEEDS HELP!!!`,
            html: emailcontent
        });

        console.log("Nearby contacts email sent successfully");

    } catch (error) {
        console.error('Error sending nearby contacts email:', error);
        throw error;
    }
}

const sendTrackingEmail = async(recipientEmails, lat, long, username, formatted_address) => {
    try {
        const timestamp = new Date().toLocaleString();
        const emailcontent = trackingLocationTemplate(username, lat, long, formatted_address, timestamp);
        const recipients = Array.isArray(recipientEmails) ? recipientEmails.join(',') : recipientEmails;

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: recipients,
            subject: `📍 Location Update - ${username}`,
            html: emailcontent
        });

        console.log("Tracking email sent successfully");
    } catch (error) {
        console.error('Error sending tracking email:', error);
        throw error;
    }
}

const sendSafeArrivalEmail = async(recipientEmails, lat, long, username, formatted_address) => {
    try {
        const timestamp = new Date().toLocaleString();
        const emailcontent = safeArrivalTemplate(username, lat, long, formatted_address, timestamp);
        const recipients = Array.isArray(recipientEmails) ? recipientEmails.join(',') : recipientEmails;

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: recipients,
            subject: `✅ ${username} Arrived Safely`,
            html: emailcontent
        });

        console.log("Safe arrival email sent successfully");
    } catch (error) {
        console.error('Error sending safe arrival email:', error);
        throw error;
    }
}

const sendTrackingStartEmail = async(recipientEmails, username) => {
    try {
        const timestamp = new Date().toLocaleString();
        const emailcontent = trackingStartTemplate(username, timestamp);
        const recipients = Array.isArray(recipientEmails) ? recipientEmails.join(',') : recipientEmails;

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: recipients,
            subject: `🚀 ${username} Started Location Tracking`,
            html: emailcontent
        });

        console.log("Tracking start email sent successfully");
    } catch (error) {
        console.error('Error sending tracking start email:', error);
        throw error;
    }
}

module.exports = {
    generateverificationToken,
    sendVerificationEmail,
    sendHelpEmailContacts,
    sendHelpEmail,
    sendTrackingStartEmail,
    sendTrackingEmail,
    sendSafeArrivalEmail
}