import { io } from 'socket.io-client';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  connect() {
    this.socket = io(SERVER_URL, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.connected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      this.connected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    this.socket.connect();
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  getSocket() {
    return this.socket;
  }

  isConnected() {
    return this.connected;
  }

  // Message events
  sendMessage(data) {
    if (this.socket) {
      this.socket.emit('send_message', data);
    }
  }

  // User events
  joinRoom(room) {
    if (this.socket) {
      this.socket.emit('join_room', room);
    }
  }

  leaveRoom(room) {
    if (this.socket) {
      this.socket.emit('leave_room', room);
    }
  }

  // Typing events
  startTyping(room) {
    if (this.socket) {
      this.socket.emit('typing_start', room);
    }
  }

  stopTyping(room) {
    if (this.socket) {
      this.socket.emit('typing_stop', room);
    }
  }

  // Private message events
  sendPrivateMessage(data) {
    if (this.socket) {
      this.socket.emit('private_message', data);
    }
  }

  // File sharing events
  sendFile(data) {
    if (this.socket) {
      this.socket.emit('file_share', data);
    }
  }

  // Message reactions
  sendReaction(data) {
    if (this.socket) {
      this.socket.emit('message_reaction', data);
    }
  }

  // Read receipts
  markAsRead(data) {
    if (this.socket) {
      this.socket.emit('message_read', data);
    }
  }
}

export default new SocketService();
