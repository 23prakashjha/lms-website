process.noDeprecation = true

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import rateLimit from 'express-rate-limit';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import('./config/passport.js');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5175', 'http://localhost:5174', 'http://localhost:3000', process.env.CLIENT_URL].filter(Boolean),
    methods: ['GET', 'POST'],
    credentials: true
  },
  pingTimeout: 60000,
  pingInterval: 25000
});

connectDB();

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5175', 'http://localhost:3000', process.env.CLIENT_URL].filter(Boolean),
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import lessonRoutes from './routes/lessonRoutes.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
import aiChatRoutes from './routes/aiChatRoutes.js';
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/ai-chat', aiChatRoutes);

const onlineUsers = new Map();
const userSockets = new Map();

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('addUser', (userId) => {
    if (userId) {
      onlineUsers.set(userId, socket.id);
      userSockets.set(socket.id, userId);
      
      socket.userId = userId;
      
      io.emit('userOnline', { userId, socketId: socket.id });
      console.log('User added:', userId, 'Socket:', socket.id);
    }
  });

  socket.on('sendMessage', (data) => {
    const { chatId, senderId, receiverId, message, createdAt } = data;
    console.log('Message sent:', { chatId, senderId, receiverId, message: message?.substring(0, 50) });

    const receiverSocketId = onlineUsers.get(receiverId);
    
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('getMessage', {
        chatId,
        senderId,
        message,
        createdAt: createdAt || Date.now()
      });
      console.log('Message delivered to:', receiverId);
    } else {
      console.log('Receiver offline:', receiverId);
    }
    
    socket.emit('messageSent', { chatId, success: true });
  });

  socket.on('joinChat', (chatId) => {
    if (chatId) {
      socket.join(`chat:${chatId}`);
      console.log('Socket joined chat:', chatId);
    }
  });

  socket.on('leaveChat', (chatId) => {
    if (chatId) {
      socket.leave(`chat:${chatId}`);
      console.log('Socket left chat:', chatId);
    }
  });

  socket.on('typing', ({ chatId, userId, isTyping }) => {
    socket.to(`chat:${chatId}`).emit('userTyping', { chatId, userId, isTyping });
  });

  socket.on('joinCourseRoom', (courseId) => {
    if (courseId) {
      socket.join(`course:${courseId}`);
    }
  });

  socket.on('leaveCourseRoom', (courseId) => {
    if (courseId) {
      socket.leave(`course:${courseId}`);
    }
  });

  socket.on('sendCourseMessage', ({ courseId, senderId, message }) => {
    if (courseId) {
      socket.to(`course:${courseId}`).emit('getCourseMessage', { 
        courseId, 
        senderId, 
        message, 
        createdAt: Date.now() 
      });
    }
  });

  socket.on('newChat', ({ chat, recipientId }) => {
    const recipientSocketId = onlineUsers.get(recipientId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('newChat', { chat });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
      userSockets.delete(socket.id);
      io.emit('userOffline', { userId: socket.userId });
    }
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

io.engine.on('connection_error', (err) => {
  console.log('Connection error:', err);
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'LMS API is running',
    onlineUsers: onlineUsers.size
  });
});

app.get('/api/online-users', (req, res) => {
  res.json({ count: onlineUsers.size, users: Array.from(onlineUsers.keys()) });
});

const PORT = process.env.PORT || 5001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.io server ready`);
});
