const express = require('express');
const router = express.Router();

router.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        const Groq = require('groq-sdk');
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful AI assistant focused on women\'s safety and general knowledge. Provide clear, helpful, and safe responses. For safety emergencies, always mention calling 100 (Police), 181 (Women Helpline), or 1091.'
                },
                {
                    role: 'user',
                    content: message
                }
            ],
            model: 'llama-3.1-8b-instant',
            max_tokens: 150,
            temperature: 0.7
        });

        const botResponse = chatCompletion.choices[0]?.message?.content || 'I\'m here to help! For emergencies, call 100 (Police) or 181 (Women Helpline).';
        res.json({ response: botResponse });
        
    } catch (error) {
        console.error('Groq API error:', error);
        
        // Fallback responses for common safety questions
        const lowerMessage = message.toLowerCase();
        let fallbackResponse = 'I apologize, but I\'m having trouble connecting right now. For emergencies, please call 100 (Police) or 181 (Women Helpline).';
        
        if (lowerMessage.includes('attack') || lowerMessage.includes('danger')) {
            fallbackResponse = 'If being attacked: 1) Scream loudly 2) Fight back - target eyes, nose, groin 3) Run to safety 4) Call 100 (Police) immediately. Trust your instincts and prioritize escape over confrontation.';
        } else if (lowerMessage.includes('safety') || lowerMessage.includes('tips')) {
            fallbackResponse = 'Safety tips: Stay alert, trust instincts, share location with trusted contacts, avoid isolated areas, carry pepper spray, learn basic self-defense. Emergency numbers: 100 (Police), 181 (Women Helpline).';
        }
        
        res.json({ response: fallbackResponse });
    }
});

module.exports = router;