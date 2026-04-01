const { processMessage } = require('../services/agentService');
const { addMessage, getHistory } = require('../services/memoryService');
const { logInfo, logError } = require('../utils/logger');

const handleChat = async (req, res) => {
    try {
        const { userId, message } = req.body;

        if (!userId) {
            logError('Missing userId in request', new Error('ValidationFailed'));
            return res.status(400).json({ success: false, message: 'Missing userId in request body.' });
        }
        if (!message || typeof message !== 'string') {
            logError('Invalid message in request', new Error('ValidationFailed'), { userId });
            return res.status(400).json({ success: false, message: 'Invalid or missing message in request body.' });
        }

        logInfo(`Processing chat message`, { userId, messageLength: message.length });

        // Store user message
        addMessage(userId, 'user', message);

        // Process message through agent service using the newly updated history
        const updatedHistory = getHistory(userId);
        const reply = await processMessage(message, updatedHistory);

        // Store bot reply
        addMessage(userId, 'bot', reply);

        logInfo(`Message replied successfully`, { userId });

        return res.status(200).json({
            success: true,
            reply: reply
        });
    } catch (error) {
        logError('Error processing chat', error, { userId: req.body?.userId });
        console.error('Error in chat controller:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while processing the chat.'
        });
    }
};

module.exports = {
    handleChat
};
