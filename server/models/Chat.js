import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  course: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course' 
  },
  participants: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  messages: [{
    sender: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    content: String,
    attachments: [{
      filename: String,
      url: String,
      type: String,
      size: Number
    }],
    createdAt: { 
      type: Date, 
      default: Date.now 
    },
    isRead: { 
      type: Boolean, 
      default: false 
    }
  }],
  lastMessage: {
    content: String,
    sender: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    createdAt: Date
  }
}, { timestamps: true });

const Chat = mongoose.model('Chat', chatSchema);
export default Chat;
