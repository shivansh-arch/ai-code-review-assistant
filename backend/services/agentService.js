const { calculatorTool, timeTool } = require('../utils/tools');
const { getAIResponse } = require('./aiService');
const { detectIntent } = require('./intentService');

// Decides whether to use tools or fallback to the AI mock based on Intent Service
async function processMessage(message, history) {
    const intent = detectIntent(message);

    if (intent === 'time') {
        return timeTool();
    }

    if (intent === 'calculator') {
        // Naive extraction for the dummy calculator tool
        const extractMath = message.replace(/[a-zA-Z]/g, '').trim();
        return calculatorTool(extractMath || message);
    }

    // Normal chat intent uses the smart mock AI
    return await getAIResponse(message, history);
}

module.exports = {
    processMessage
};
