const asyncHandler = require('express-async-handler');
const { Incident } = require('../models/incidentRptModel');
const { User } = require('../models/userModel')

const fs = require('fs');
const path = require('path')
const AWS = require('aws-sdk')
require('dotenv').config();

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-2'
})

const s3 = new AWS.S3();

const addIncident = asyncHandler(async (req, res) => {
    try {
        console.log('Incident request received');
        console.log('Body:', req.body);
        console.log('Files:', req.files);
        
        const { user, report, pincodeOfIncident, address } = req.body;
        
        if (!user) {
            return res.status(400).json({ message: "User ID is required" });
        }
        if (!report) {
            return res.status(400).json({ message: "Report is required" });
        }
        
        let fileUrls = [];
        
        // Handle file uploads if files exist
        if (req.files && req.files.length > 0) {
            console.log('Files uploaded:', req.files.length);
            fileUrls = req.files.map(file => `/uploads/${file.filename}`);
            console.log('File URLs:', fileUrls);
        }
        
        // Create incident with file URLs
        const incident = await Incident.create({
            user,
            report,
            pincodeOfIncident: pincodeOfIncident || "000000",
            address: address || "Not specified",
            meidaSt: fileUrls.length > 0 ? fileUrls[0] : null,
            files: fileUrls
        });
        
        console.log('Incident created successfully:', incident._id);
        res.status(201).json({ message: "Incident reported successfully", files: fileUrls });
        
    } catch (error) {
        console.error('Incident creation error:', error);
        res.status(500).json({ message: error.message || "Something went wrong" });
    }
});


const getAllIncidents = asyncHandler(async(req,res) => {

    const incidents = await Incident.find({});
    const data = []
    for(const x of incidents){
        const user = await User.findById(x.user);
        console.log(user)
        if(user){
            data.push({
                uname: user.uname,
                address: x.address,
                pincode: x.pincodeOfIncident,
                report: x.report,
                isSeen: x.isSeen,
                image: x.meidaSt || "empty",
                files: x.files || [],
                createdAt: x.createdAt,
                updatedAt: x.updatedAt
            })
        }
        
    }
    res.status(200).json(data)
});

const acknowledgeInc = asyncHandler(async(req,res) => {
    try {
        const inc = req.params.id;
        const incident = await Incident.findById(inc);
        
        if (!incident) {
            return res.status(404).json({ message: "Incident not found" });
        }
        
        incident.isSeen = true;
        await incident.save();
        
        res.status(200).json({ message: "Incident acknowledged" });
        
    } catch (error) {
        console.error('Acknowledge incident error:', error);
        res.status(500).json({ message: "Failed to acknowledge incident", error: error.message });
    }
})

module.exports = {addIncident ,getAllIncidents,acknowledgeInc}