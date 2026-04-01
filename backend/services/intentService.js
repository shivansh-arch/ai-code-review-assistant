/**
 * Detects intent from the given text
 * Returns 'calculator', 'time', or 'normal'
 */
function detectIntent(message) {
    if (!message || typeof message !== 'string') return 'normal';
    
    const lowerMsg = message.toLowerCase();

    // Time/Date intent
    if (lowerMsg.includes('time') || lowerMsg.includes('date')) {
        return 'time';
    }

    // Calculator intent: check if string has keywords or looks like a math expression
    const isMathIntent = lowerMsg.includes('calculate') || 
                         lowerMsg.includes('math') || 
                         /[0-9]+\s*[+\-*/]\s*[0-9]+/.test(message);
                         
    if (isMathIntent) {
        return 'calculator';
    }

    // Default intent
    return 'normal';
}

module.exports = {
    detectIntent
};
