const mongoose = require("mongoose");

const ChatSchema = mongoose.Schema({


    sender:{
        type: mongoose.Schema.Types.Mixed,
        required: true
    },

    receiver: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },

    textChat: {
        type: String,
        required: [true,"message is required"]
    },
    
    emergency: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    }
});

const Chat = mongoose.model('Chat',ChatSchema);
module.exports = {Chat}