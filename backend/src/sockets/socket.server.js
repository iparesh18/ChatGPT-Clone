const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const aiService = require("../services/ai.service");
const messageModel = require("../models/message.model");
const { createMemory, queryMemory } = require("../services/vector.service");
const { scrapeWebsite } = require("../services/webscraper.service");


function initSocketServer(HttpServer) {
  const io = new Server(HttpServer, {
    cors: {
      origin: "https://chat-gpt-clone-five-green.vercel.app",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // ============================
  // SOCKET AUTH
  // ============================
  io.use(async (socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

    if (!cookies.token) {
      return next(new Error("Authentication error: no token provided"));
    }

    try {
      const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);
      const user = await userModel.findById(decoded.id).select("-password");

      if (!user) return next(new Error("Authentication error: user not found"));

      socket.user = user;
      next();
    } catch (error) {
      console.error("Socket auth error:", error);
      next(new Error("Authentication error: invalid token"));
    }
  });

  // ============================
  // SOCKET CONNECTION
  // ============================
  io.on("connection", (socket) => {
    socket.on("ai-message", async (messagePayload) => {
      try {
        let userMessage = messagePayload.content;

        // -------------------------------------------------------------------
        // (1) URL DETECTION
        // -------------------------------------------------------------------
        const urlRegex = /(https?:\/\/[^\s]+)/;
        const url = userMessage.match(urlRegex)?.[0];

        let scrapedContent = "";

        if (url) {
          console.log("📎 URL detected:", url);
          scrapedContent = await scrapeWebsite(url);
        }

        // remove scraped content from the user message shown in UI
        if (userMessage.length > 5000) {
          userMessage = userMessage.slice(0, 5000);
        }

        // -------------------------------------------------------------------
        // (2) Save user message + generate vector
        // -------------------------------------------------------------------
        const [message, vectors] = await Promise.all([
          messageModel.create({
            chat: messagePayload.chat,
            user: socket.user._id,
            content: userMessage,
            role: "user",
          }),

          aiService.generateVector(userMessage),
        ]);

        // -------------------------------------------------------------------
        // (3) Query MEMORY + STM
        // -------------------------------------------------------------------
        const [memory, chatHistoryRaw] = await Promise.all([
          queryMemory({
            queryVector: vectors,
            limit: 3,
            filter: {
              user: { $eq: socket.user._id.toString() },
            },
          }),

          messageModel
            .find({
              chat: messagePayload.chat,
              user: socket.user._id,
            })
            .sort({ createdAt: -1 })
            .limit(10)
            .lean(),
        ]);

        const chatHistory = chatHistoryRaw.reverse();

        // -------------------------------------------------------------------
        // (4) Store vector for user message
        // -------------------------------------------------------------------
        await createMemory({
          vectors,
          messageId: message._id,
          metadata: {
            user: socket.user._id.toString(),
            chat: messagePayload.chat,
            text: userMessage,
            type: "user-message",
          },
        });

        // -------------------------------------------------------------------
        // (5) Build STM
        // -------------------------------------------------------------------
        const stm = chatHistory.map((item) => ({
          role: item.role,
          parts: [{ text: item.content }],
        }));

        // -------------------------------------------------------------------
        // (6) Prepare Long-term memory text
        // -------------------------------------------------------------------
        const ltmText = memory?.length
          ? memory.map((m) => m.metadata?.text || "").join("\n")
          : "";
        // -------------------------------------------------------------------
        // (7) MERGE LTM + SCRAPED CONTENT INTO A HIDDEN PROMPT
        // -------------------------------------------------------------------
        let hiddenContext = "";

        if (ltmText) {
          hiddenContext += `Relevant long-term memory:\n${ltmText}\n\n`;
        }

        if (scrapedContent) {
          hiddenContext += `Scraped website content:\n${scrapedContent}\n\n`;
        }

        // -------------------------------------------------------------------
        // (8) CALL AI — ONLY user+model roles allowed
        // -------------------------------------------------------------------
        const response = await aiService.generateResponse([
          ...stm,
          {
            role: "user",
            parts: [
              {
                text: hiddenContext + "\nUser asked: " + userMessage,
              },
            ],
          },
        ]);

        // -------------------------------------------------------------------
        // (9) Save AI response + its vector
        // -------------------------------------------------------------------
        const [responseMessage, responseVectors] = await Promise.all([
          messageModel.create({
            chat: messagePayload.chat,
            user: socket.user._id,
            content: response,
            role: "model",
          }),

          aiService.generateVector(response),
        ]);

        await createMemory({
          vectors: responseVectors,
          messageId: responseMessage._id,
          metadata: {
            user: socket.user._id.toString(),
            chat: messagePayload.chat,
            text: response,
            type: "assistant-response",
          },
        });

        // -------------------------------------------------------------------
        // (10) SEND RESPONSE TO FRONTEND
        // -------------------------------------------------------------------
        socket.emit("ai-response", {
          content: response,
          chat: messagePayload.chat,
        });
      } catch (err) {
        console.error("AI Message Error:", err);
        socket.emit("ai-response", {
          content: "Server error, please try again.",
          chat: messagePayload.chat,
        });
      }
    });
  });
}

module.exports = initSocketServer;
