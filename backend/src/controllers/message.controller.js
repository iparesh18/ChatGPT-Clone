const messageModel = require("../models/message.model");

async function getMessages(req, res) {
  const { chatId } = req.params;

  const messages = await messageModel
    .find({ chat: chatId, user: req.user._id })
    .sort({ createdAt: 1 })
    .lean();

  res.json({ messages });
}

module.exports = { getMessages };
