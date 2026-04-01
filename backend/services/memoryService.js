// In-memory storage for chat history mapping userId -> array of message objects

const chatMemory = new Map();

function getHistory(userId) {
    if (!chatMemory.has(userId)) {
        chatMemory.set(userId, []);
    }
    return chatMemory.get(userId);
}

function addMessage(userId, role, content) {
    const history = getHistory(userId);
    history.push({ role, content, timestamp: new Date().toISOString() });
    
    // Limit history memory footprint to last 50 messages per user
    if (history.length > 50) {
        history.shift();
    }
    
    return history;
}

function clearHistory(userId) {
    chatMemory.delete(userId);
}

module.exports = {
    getHistory,
    addMessage,
    clearHistory
};
