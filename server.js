const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const Message = require("./models/Message");
const Question = require("./models/Question");
const Comment = require("./models/Comment");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

mongoose.connect("mongodb://127.0.0.1:27017/shehealth", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(()=>console.log("✅ MongoDB connected"))
.catch(err=>console.error("❌ MongoDB connection error:", err));

// Chat messages API
app.get("/api/messages/:room", async (req,res)=>{
  try {
    const messages = await Message.find({room:req.params.room}).sort({timestamp:1});
    res.json({messages});
  } catch(err){ res.status(500).json({error:err.message}); }
});

// Questions API
app.get("/api/questions", async (req,res)=>{
  try {
    const questions = await Question.find().sort({timestamp:-1});
    res.json({questions});
  } catch(err){ res.status(500).json({error:err.message}); }
});

app.post("/api/questions", async (req,res)=>{
  try {
    const {title, body, username} = req.body;
    const question = new Question({title, body, username, upvotes:[], comments:[]});
    await question.save();
    res.json({success:true, question});
  } catch(err){ res.status(500).json({error:err.message}); }
});

app.post("/api/questions/upvote/:id", async (req,res)=>{
  try {
    const { userId } = req.body;
    const question = await Question.findById(req.params.id);
    if(!question) return res.status(404).json({success:false, message:'Question not found'});
    if(question.upvotes.includes(userId)) return res.json({success:false, message:'Already upvoted'});
    question.upvotes.push(userId);
    await question.save();
    res.json({success:true});
  } catch(err){ res.status(500).json({success:false, message:err.message}); }
});

// Serve main chat page
app.get("/",(req,res)=>{ res.sendFile(path.join(__dirname,"public","index.html")); });

// Socket.IO for chat
io.on("connection", socket => {
  console.log("🔗 New user connected:", socket.id);

  socket.on("joinRoom", room => { socket.join(room); });

  socket.on("sendMessage", async msg => {
    const messageData = new Message(msg);
    await messageData.save();
    io.to(msg.room).emit("receiveMessage", msg);
  });

  socket.on("disconnect", ()=>{ console.log("❌ User disconnected:", socket.id); });
});

const PORT=5000;
server.listen(PORT,()=>console.log(`🚀 Server running on http://localhost:${PORT}`));
