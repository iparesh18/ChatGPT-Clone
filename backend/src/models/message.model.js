const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    chat: {
      type: Schema.Types.ObjectId,
      ref: "chat",
    },
    content: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "model", "system"],
      default: "user",
    },
  },
  { timestamps: true }
);
const messageModel = mongoose.model("message", messageSchema);

module.exports = messageModel;
