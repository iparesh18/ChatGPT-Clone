const express = require('express');
const router = express.Router();
const authMiddleware  = require('../middlewares/auth.middleware');
const chatController = require('../controllers/chat.controller');
const messageController = require('../controllers/message.controller');


// create chat
router.post("/", authMiddleware.authUser, chatController.createChat);

// get all chats
router.get("/", authMiddleware.authUser, chatController.getAllChats);

// get messages from chat
router.get("/:chatId/messages", authMiddleware.authUser, messageController.getMessages);

router.delete("/:id", authMiddleware.authUser, chatController.deleteChat); 

module.exports = router;
