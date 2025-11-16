const asyncHandler = require("express-async-handler");
const {User} = require('../models/userModel');
const {Emergency} = require('../models/emergencyModel')

const {sendHelpEmail,sendHelpEmailContacts} = require('../utils/email');
const {sendFast2SMS} = require('../utils/fast2sms');
const {sendEmergencySMS} = require('../utils/freeSmsService');
const {sendEmergencyMessages} = require('../utils/simpleEmergency');
const {sendEmergencySMSOnly} = require('../utils/simpleSMS');
const {sendWhatsAppEmergency} = require('../utils/whatsappEmergency');
const {sendAutoWhatsApp} = require('../utils/autoWhatsApp');
const {sendRealFreeSMS} = require('../utils/realFreeSMS');
const {sendWorkingSMS} = require('../utils/workingSMS');
const {sendFinalEmergencyAlerts} = require('../utils/finalEmergency');
const {sendWorkingFast2SMS} = require('../utils/workingFast2SMS');
const {sendRCSEmergencyAlerts} = require('../utils/rcsEmergency');
const {sendWorkingRCS} = require('../utils/workingRCS');
const {sendSmartEmergency} = require('../utils/smartEmergency');
const {sendEmergencyWebPush} = require('../utils/webPush');
const {sendTwilioEmergency} = require('../utils/twilioSMS');
const axios = require('axios')
let pincode;
let formattedAddress;


const getData = async(url) => {

  try{
    
    let {data} = await axios.get(url)
    
    return data
  }catch(e){
    console.log(e.message);
  }
}

const sendemergencyCntrl = asyncHandler(async (req, res) => {
  try {
    console.log('Emergency request received:', req.body);
    const {userId, lat, long} = req.body;
    
    if(!userId || !lat || !long){
      console.log('Missing required fields:', {userId: !!userId, lat: !!lat, long: !!long});
      return res.status(400).json({message: "userId, latitude and longitude are required"});
    }
    
    // Validate coordinates
    const latitude = parseFloat(lat);
    const longitude = parseFloat(long);
    
    if(isNaN(latitude) || isNaN(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return res.status(400).json({message: "Invalid coordinates provided"});
    }
    
    const user = await User.findById(userId);
    if(!user){
      console.log('User not found:', userId);
      return res.status(404).json({message: "User not found"});
    }
    
    console.log('User found:', user.uname);
    
    // Create emergency record immediately
    const emergency = await Emergency.create({
      user: userId,
      emergencyLctOnMap: `https://maps.google.com/maps?q=${latitude},${longitude}&hl=en&z=14`,
      addressOfIncd: `Emergency at ${latitude}, ${longitude}`
    });
    
    console.log('Emergency record created:', emergency._id);
    
    // Respond immediately
    res.status(200).json({
      message: "Emergency SOS sent successfully", 
      emergencyId: emergency._id,
      location: `${latitude}, ${longitude}`
    });
    
    // Send emergency messages immediately
    try {
      console.log('🚨 SENDING EMERGENCY ALERTS 🚨');
      console.log('User:', user.uname);
      console.log('Emergency contacts:', {
        email: user.emergencyMail,
        phone: user.emergencyNo,
        extra1: user.extraphone1
      });
      
      // Send Twilio SMS first (most reliable) - only if enabled
      if (user.twilioSmsEnabled && (user.emergencyNo || user.extraphone1 || user.extraphone2)) {
        console.log('📱 Sending Twilio SMS...');
        await sendTwilioEmergency(user, latitude, longitude);
      } else if (!user.twilioSmsEnabled) {
        console.log('📱 Twilio SMS disabled by user');
      }
      
      // Send emails as backup
      if (user.emergencyMail || user.extraEmail1 || user.extraEmail2) {
        console.log('📧 Sending emergency emails...');
        await sendEmergencyMessages(user, latitude, longitude);
      }
      
      console.log('✅ All emergency alerts sent!');
    } catch (error) {
      console.error('❌ Emergency alert error:', error);
    }
    
    // Process detailed emails in background
    setImmediate(() => {
      processEmergencyEmails(userId, latitude, longitude, user, emergency._id);
    });
    
  } catch(error) {
    console.error('Emergency controller error:', error);
    if(!res.headersSent) {
      res.status(500).json({message: "Emergency service failed", error: error.message});
    }
  }
});

const processEmergencyEmails = async (userId, lat, long, user, emergencyId) => {
  try {
    console.log('Processing emergency emails for:', user.uname);
    let pincode = "Unknown";
    let formattedAddress = `Emergency at ${lat}, ${long}`;
    
    // Get accurate location with retry
    try {
      const resp = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}&addressdetails=1`, {
        headers: { 'User-Agent': 'WomenSafetyApp/1.0' },
        timeout: 8000
      });
      
      if(resp.data && resp.data.address) {
        pincode = resp.data.address.postcode || "Unknown";
        const addr = resp.data.address;
        formattedAddress = `${addr.road || addr.neighbourhood || ''}, ${addr.suburb || ''}, ${addr.city || 'Unknown'}, ${addr.state || ''}, ${pincode}`.replace(/^,\s*|,\s*$/g, '').replace(/,\s*,/g, ',');
        console.log('Address resolved:', formattedAddress);
      }
    } catch(error) {
      console.log('Geocoding failed, using coordinates:', error.message);
    }
    
    // Update emergency with accurate address
    try {
      await Emergency.findByIdAndUpdate(emergencyId, {
        addressOfIncd: formattedAddress
      });
    } catch(error) {
      console.log('Failed to update emergency record:', error.message);
    }
    
    // Collect recipient emails
    const recipients = [];
    if(user.emergencyMail) recipients.push(user.emergencyMail);
    if(user.extraEmail1) recipients.push(user.extraEmail1);
    if(user.extraEmail2) recipients.push(user.extraEmail2);
    
    console.log('Emergency contacts:', recipients.length);
    
    // Send to emergency contacts
    if(recipients.length > 0) {
      try {
        await sendHelpEmail(recipients, lat, long, user.uname, pincode, formattedAddress);
        console.log('Emergency emails sent successfully');
      } catch(error) {
        console.error('Failed to send emergency emails:', error.message);
      }
    } else {
      console.log('No emergency contacts configured');
    }
    
    // Send SMS to emergency contacts
    const smsNumbers = [];
    if(user.emergencyNo) smsNumbers.push(user.emergencyNo.toString());
    if(user.extraphone1) smsNumbers.push(user.extraphone1);
    if(user.extraphone2) smsNumbers.push(user.extraphone2);
    
    console.log('Emergency SMS contacts:', smsNumbers.length);
    
    for(const phoneNumber of smsNumbers) {
      try {
        await sendEmergencySMS(phoneNumber, user.uname, lat, long, formattedAddress);
        console.log(`Emergency SMS sent to ${phoneNumber}`);
      } catch(error) {
        console.error(`Failed to send SMS to ${phoneNumber}:`, error.message);
      }
    }
    
    // Send to nearby users
    if(pincode !== "Unknown") {
      try {
        const users = await User.find({pinCode: pincode});
        const nearby = users.filter(x => x.email && x._id.toString() !== userId).map(x => x.email);
        
        console.log('Nearby users found:', nearby.length);
        
        if(nearby.length > 0) {
          await sendHelpEmailContacts(nearby, lat, long, user.uname, pincode, formattedAddress);
          console.log('Nearby contact emails sent successfully');
        }
      } catch(error) {
        console.error('Failed to send nearby contact emails:', error.message);
      }
    }
    
  } catch(error) {
    console.error('Background processing error:', error);
  }
};


const getAllEmergencies = asyncHandler(async(req,res) => {
  const data = []
  const emer = await Emergency.find({});
  for(const x of emer){
    console.log(x.createdAt)
    const user = await User.findById(x.user);
    if(user){
      data.push({
        _id: x._id,
        mapLct: x.emergencyLctOnMap,
        addressOfInc: x.addressOfIncd,
        username: user.uname,
        userId: user._id,
        emergencyNo: user.emergencyNo,
        isResolved: x.isResolved,
        createdAt: x.createdAt,
        updatedAt: x.updatedAt
      })
    }
  }
  res.status(200).json(data)
});


const getSinglEmergency = asyncHandler(async(req,res) => {
  try {
    const id = req.params.id;
    const emergency = await Emergency.findById(id);
    
    if(!emergency){
      return res.status(404).json({message: "Emergency not found"});
    }
    
    emergency.isResolved = true;
    await emergency.save();
    
    const user = await User.findById(emergency.user);
    if(!user){
      return res.status(404).json({message: "User not found"});
    }
    
    res.status(200).json({
      _id: emergency._id,
      mapLct: emergency.emergencyLctOnMap,
      addressOfInc: emergency.addressOfIncd,
      username: user.uname,
      emergencyNo: user.emergencyNo,
      isResolved: emergency.isResolved
    });
    
  } catch(error) {
    console.error('Get emergency error:', error);
    res.status(500).json({message: "Failed to get emergency", error: error.message});
  }
})


const emergencyUpdate = asyncHandler(async(req,res) => {
  try {
    const emerg = req.params.id;
    const emerge = await Emergency.findById(emerg);
    
    if(!emerge){
      return res.status(404).json({message: "Emergency not found"});
    }
    
    emerge.isResolved = true;
    await emerge.save();
    
    res.status(200).json({message: "Emergency resolved successfully"});
    
  } catch(error) {
    console.error('Emergency update error:', error);
    res.status(500).json({message: "Failed to update emergency", error: error.message});
  }
})
module.exports = { sendemergencyCntrl,getAllEmergencies,getSinglEmergency,emergencyUpdate };
