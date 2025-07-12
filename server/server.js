const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { PORT, CORS_ORIGIN, RATE_LIMIT } = require('./config/config');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors({ origin: CORS_ORIGIN }));
app.use(helmet()); // For security
app.use(rateLimit(RATE_LIMIT));
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.json({
    message: '🕶️ Incognito Wachira Server',
    status: 'running',
    description: 'Anonymous real-time chat server',
    endpoints: {
      socketio: '/socket.io/',
      client: 'http://localhost:3000'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// In-memory storage (in production, use a database)
const users = new Map();
const rooms = new Map();
const messages = new Map();
const typingUsers = new Map();

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // User joins
  socket.on('join_room', (roomName) => {
    socket.join(roomName);
    
    // Add user to room
    if (!rooms.has(roomName)) {
      rooms.set(roomName, new Set());
    }
    rooms.get(roomName).add(socket.id);
    
    // Notify others in room
    socket.to(roomName).emit('user_joined', {
      user: users.get(socket.id)?.username || 'Unknown',
      room: roomName
    });
    
    // Send online users in room
    const roomUsers = Array.from(rooms.get(roomName) || []).map(socketId => users.get(socketId)).filter(Boolean);
    io.to(roomName).emit('online_users', roomUsers);
  });

  // User leaves room
  socket.on('leave_room', (roomName) => {
    socket.leave(roomName);
    
    if (rooms.has(roomName)) {
      rooms.get(roomName).delete(socket.id);
      
      // Notify others in room
      socket.to(roomName).emit('user_left', {
        user: users.get(socket.id)?.username || 'Unknown',
        room: roomName
      });
      
      // Send updated online users
      const roomUsers = Array.from(rooms.get(roomName) || []).map(socketId => users.get(socketId)).filter(Boolean);
      io.to(roomName).emit('online_users', roomUsers);
    }
  });

  // Set user info
  socket.on('set_user', (userData) => {
    users.set(socket.id, userData);
    socket.join('general'); // Join general room by default
    
    if (!rooms.has('general')) {
      rooms.set('general', new Set());
    }
    rooms.get('general').add(socket.id);
    
    // Send updated online users
    const roomUsers = Array.from(rooms.get('general') || []).map(socketId => users.get(socketId)).filter(Boolean);
    io.to('general').emit('online_users', roomUsers);
  });

  // Handle messages
  socket.on('send_message', (data) => {
    const { message, room } = data;
    
    // Add message to storage
    if (!messages.has(room)) {
      messages.set(room, []);
    }
    messages.get(room).push(message);
    
    // Broadcast to room
    io.to(room).emit('message_received', { room, message });
    
    // Send delivery acknowledgment
    socket.emit('message_status_update', {
      roomId: room,
      messageId: message.id,
      status: 'delivered'
    });
  });

  // Handle private messages
  socket.on('private_message', (data) => {
    const { recipientId, message, chatId } = data;
    
    // Find recipient socket
    const recipientSocket = Array.from(io.sockets.sockets.entries())
      .find(([socketId, socket]) => users.get(socketId)?.id === recipientId);
    
    if (recipientSocket) {
      // Send to recipient
      recipientSocket[1].emit('private_message_received', {
        chatId,
        message,
        senderId: users.get(socket.id)?.id
      });
      
      // Send to sender for confirmation
      socket.emit('private_message_received', {
        chatId,
        message,
        senderId: users.get(socket.id)?.id
      });
    }
  });

  // Typing indicators
  socket.on('typing_start', (room) => {
    const username = users.get(socket.id)?.username;
    if (!username) return;
    
    if (!typingUsers.has(room)) {
      typingUsers.set(room, new Set());
    }
    typingUsers.get(room).add(username);
    
    socket.to(room).emit('typing_update', {
      room,
      users: Array.from(typingUsers.get(room) || [])
    });
  });

  socket.on('typing_stop', (room) => {
    const username = users.get(socket.id)?.username;
    if (!username) return;
    
    if (typingUsers.has(room)) {
      typingUsers.get(room).delete(username);
      
      socket.to(room).emit('typing_update', {
        room,
        users: Array.from(typingUsers.get(room) || [])
      });
    }
  });

  // File sharing
  socket.on('file_share', (data) => {
    const { room, type, name, size } = data;
    const username = users.get(socket.id)?.username;
    
    const fileMessage = {
      id: Date.now().toString(),
      text: `📎 ${name} (${(size / 1024).toFixed(1)}KB)`,
      sender: username,
      timestamp: new Date().toISOString(),
      type: 'file',
      fileData: data
    };
    
    // Add to storage
    if (!messages.has(room)) {
      messages.set(room, []);
    }
    messages.get(room).push(fileMessage);
    
    // Broadcast to room
    io.to(room).emit('message_received', { room, message: fileMessage });
  });

  // Message reactions
  socket.on('message_reaction', (data) => {
    const { roomId, messageId, reaction } = data;
    const username = users.get(socket.id)?.username;
    
    io.to(roomId).emit('reaction_added', {
      roomId,
      messageId,
      reaction: { type: reaction, user: username }
    });
  });

  // Read receipts
  socket.on('message_read', (data) => {
    const { roomId, messageId } = data;
    
    socket.to(roomId).emit('message_status_update', {
      roomId,
      messageId,
      status: 'read'
    });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    
    // Remove from all rooms
    rooms.forEach((roomUsers, roomName) => {
      if (roomUsers.has(socket.id)) {
        roomUsers.delete(socket.id);
        
        // Notify others in room
        socket.to(roomName).emit('user_left', {
          user: users.get(socket.id)?.username || 'Unknown',
          room: roomName
        });
        
        // Send updated online users
        const roomUsers = Array.from(rooms.get(roomName) || []).map(socketId => users.get(socketId)).filter(Boolean);
        io.to(roomName).emit('online_users', roomUsers);
      }
    });
    
    // Remove from typing users
    const username = users.get(socket.id)?.username;
    if (username) {
      typingUsers.forEach((typingSet, room) => {
        if (typingSet.has(username)) {
          typingSet.delete(username);
          socket.to(room).emit('typing_update', {
            room,
            users: Array.from(typingSet)
          });
        }
      });
    }
    
    // Remove user
    users.delete(socket.id);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

