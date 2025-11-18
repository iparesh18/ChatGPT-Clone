const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
/* Routes */
const authRoutes = require("./routes/auth.routes");
const chatRoutes = require("./routes/chat.routes");

const app = express();

/* Middlewares */
app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: "http://chat-gpt-clone-five-green.vercel.app/",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("its running...");
});

/* Using Routes */
app.use("/auth", authRoutes);
app.use("/chat", chatRoutes);

module.exports = app;
