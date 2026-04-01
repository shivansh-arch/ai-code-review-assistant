const { logError, logInfo } = require('../utils/logger');

const SYSTEM_INSTRUCTION = `You are a senior developer and an expert coding mentor. Your goal is to review code, provide feedback, and guide the user to solve problems on their own. 

CRITICAL RULES:
1. DO NOT provide the complete solution or full code snippets right away.
2. If the user asks a coding question, ask Socratic (guiding) questions to help them think about the problem.
3. Point out where an error might be or explain the conceptual bugs, but let the user write the final code.
4. Provide small hints, pseudo-code structures, or links/references to official documentation if necessary.
5. Be encouraging, constructive, and patient.
6. If the user is just saying hello, greet them as their coding mentor.
7. Use Markdown to format your responses cleanly.`;

async function getAIResponse(message, history) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
        return "⚠️ **Configuration Error**: The `GEMINI_API_KEY` is completely missing or invalid. Please open the `backend/.env` file and set your real API key before chatting.";
    }

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        // Transform history into Gemini's format
        // history [{role: 'user'/'bot', content: '...'}] -> {role: 'user'/'model', parts: [{text: '...'}]}
        // Exclude the CURRENT message from history since we append it separately, or just pass history if it already includes the current message.
        // Wait, in chatController.js we do `addMessage(userId, 'user', message); const updatedHistory = getHistory(userId);`
        // So `history` ALREADY includes the current user message at the very end.
        const contents = history.map(msg => {
            // Force string conversion to prevent any accidentally stored Promises 
            // from being stringified into `{}` which breaks Gemini's REST JSON structure.
            let textContent = msg.content;
            if (typeof textContent !== 'string') {
                textContent = String(textContent);
                if (textContent === '[object Promise]') {
                    textContent = "Oops, a system error occurred in memory storage.";
                }
            }
            return {
                role: msg.role === 'bot' ? 'model' : 'user',
                parts: [{ text: textContent }]
            };
        });

        const payload = {
            systemInstruction: {
                parts: [{ text: SYSTEM_INSTRUCTION }]
            },
            contents: contents
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Gemini API Error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        
        if (data && data.candidates && data.candidates.length > 0) {
            return data.candidates[0].content.parts[0].text;
        }

        return "I received a response, but it was empty or incorrectly formatted.";

    } catch (error) {
        logError('Failed to fetch from Gemini API', error, { messageStringLength: message.length });
        return "I'm having trouble connecting to my external LLM API right now. Please check your internet connection and API key limits.";
    }
}

module.exports = {
    getAIResponse
};
