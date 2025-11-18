const chatModel = require("../models/chat.model")
const express = require("express")
const messageModel = require("../models/message.model");


async function createChat(req,res){
    const {title} = req.body
    const user = req.user 
    const chat = await chatModel.create({
        user: user._id,
        title
    })
    res.status(201).json({
        message:"Chat created successfully",
        chat:{
            id: chat._id,
            title: chat.title,
            lastActivity: chat.lastActivity
        }
    })
}

async function getAllChats(req, res) {
  const user = req.user;

  const chats = await chatModel
    .find({ user: user._id })
    .sort({ updatedAt: -1 })
    .lean();

  res.json({ chats });
}


async function deleteChat(req, res) {
  try {
    const chatId = req.params.id;
    const userId = req.user._id;

    // only delete chat belonging to user
    const chat = await chatModel.findOneAndDelete({
      _id: chatId,
      user: userId,
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // delete all messages under this chat
    await messageModel.deleteMany({ chat: chatId, user: userId });

    res.json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.error("Delete Chat Error:", error);
    res.status(500).json({ message: "Server error" });
  }
}


module.exports = {
    createChat,
    getAllChats,
    deleteChat
}
