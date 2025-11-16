const Groq = require('groq-sdk');

const testGroq = async () => {
    try {
        const groq = new Groq({ apiKey: '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' });
        
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: 'Hello, how are you?' }],
            model: 'llama-3.1-8b-instant',
            max_tokens: 50
        });

        console.log('Groq API Response:', chatCompletion.choices[0]?.message?.content);
    } catch (error) {
        console.error('Groq API Error:', error.message);
    }
};

testGroq();