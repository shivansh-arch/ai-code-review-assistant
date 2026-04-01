const express = require('express');
const router = express.Router();
const { handleChat } = require('../controllers/chatController');
const rateLimiter = require('../middleware/rateLimiter');

// POST /api/chatbot/chat
router.post('/chat', rateLimiter, handleChat);

module.exports = router;
