const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const chatSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    title: {
        type: String,
        required: true
    },
    lastActivity: {
        type: Date,
        default: Date.now
    }
}
, { timestamps: true }
)

const chatModel = mongoose.model("chat", chatSchema)
module.exports = chatModel
