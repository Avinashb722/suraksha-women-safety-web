const Router = require("express");
const router = Router();
const {addChats,getChats} = require('../controllers/chatCntrl')
const validateToken = require('../middlewares/validateToken');

router.route('/').post(addChats);
router.route('/:id/emergncye/:emerg').get(getChats);
router.route('/emergency/:emergId').get(async (req, res) => {
    try {
        const { emergId } = req.params;
        console.log('Fetching chats for emergency:', emergId);
        const chats = await require('../models/chatVictimModel').Chat.find({ emergency: emergId }).sort({ createdAt: 1 });
        console.log('Found chats:', chats.length);
        res.status(200).json(chats);
    } catch (error) {
        console.error('Error fetching chats:', error);
        res.status(500).json({ message: 'Error fetching chats', error: error.message });
    }
});

// Test route
router.route('/test').post(async (req, res) => {
    try {
        const testChat = {
            sender: 'test-sender',
            receiver: 'test-receiver', 
            textChat: 'Test message',
            emergency: 'test-emergency'
        };
        const result = await require('../models/chatVictimModel').Chat.create(testChat);
        res.status(201).json({ message: 'Test chat created', result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



module.exports = router;