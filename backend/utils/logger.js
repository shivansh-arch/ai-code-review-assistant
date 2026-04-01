// Simple logger utility
const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '..', 'app.log');

function logInfo(message, context = {}) {
    const logEntry = `[INFO] ${new Date().toISOString()} - ${message} - Context: ${JSON.stringify(context)}\n`;
    console.log(`ℹ️ [INFO] ${message}`, context);
    appendLog(logEntry);
}

function logError(message, error, context = {}) {
    const logEntry = `[ERROR] ${new Date().toISOString()} - ${message} - Error: ${error.message} - Context: ${JSON.stringify(context)}\n`;
    console.error(`❌ [ERROR] ${message}`, error);
    appendLog(logEntry);
}

function appendLog(entry) {
    try {
        fs.appendFileSync(logFilePath, entry);
    } catch (err) {
        console.error("Failed to write to log file", err);
    }
}

// Express Middleware for request logging
const requestLogger = (req, res, next) => {
    logInfo(`${req.method} ${req.originalUrl}`, { ip: req.ip });
    next();
};

module.exports = {
    logInfo,
    logError,
    requestLogger
};
