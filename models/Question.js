const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  title: String,                  // question title
  body: String,                   // question body/content
  username: String,               // user who posted
  votes: { type: Number, default: 0 }, // number of upvotes
  voters: [String],               // list of userIds who have upvoted
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Question", questionSchema);
