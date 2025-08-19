// const mongoose = require("mongoose");

// const messageSchema = new mongoose.Schema({
//   room: String,                   // chat room name
//   username: String,               // user sending message
//   message: String,                // message text
//   type: { type: String, default: "message" }, // 'message' or 'question'
//   timestamp: { type: Date, default: Date.now } 
// });

// module.exports = mongoose.model("Message", messageSchema);


const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  room: String,
  username: String,
  message: String,
  type: { type: String, default: "message" }, // "message" or "question"
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Message", messageSchema);
