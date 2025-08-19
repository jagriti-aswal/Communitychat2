const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" }, // linked question
  username: String,               // user who commented
  text: String,                   // comment text
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Comment", commentSchema);
