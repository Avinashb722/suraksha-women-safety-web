const asyncHandler = require('express-async-handler');
const { User } = require('../models/userModel');
const {Chat} = require('../models/chatVictimModel')
const {Emergency} = require('../models/emergencyModel')


const addChats = asyncHandler(async(req,res) => {
    try {
        const {senderId, receiverId, text, emergId} = req.body;
        
        console.log('Chat request received:', {senderId, receiverId, text, emergId});
        
        if (!text || !emergId) {
            return res.status(400).json({message: "Missing required fields"});
        }

        // Use string IDs directly without ObjectId validation
        const chatData = {
            sender: senderId || 'unknown',
            receiver: receiverId || 'unknown',
            textChat: text,
            emergency: emergId
        };
        
        console.log('Creating chat with data:', chatData);
        const newChat = await Chat.create(chatData);
        
        console.log('Chat created successfully:', newChat._id);
        res.status(201).json({message: "Message sent successfully", chat: newChat});
        
    } catch (error) {
        console.error('Error creating chat:', error);
        res.status(500).json({message: "Server error", error: error.message});
    }
});

const getChats = asyncHandler(async(req,res) => {

    const receiver = req.params.id;
    const emerg = req.params.emerg;
    const chats = await Chat.find({receiver: receiver, emergency:emerg});
    if(chats){
        res.status(200).json(chats)

    }else{
        res.status(204).json({message: "No content to show"})
    }
})


module.exports = {addChats,getChats}