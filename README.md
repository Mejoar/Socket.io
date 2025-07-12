# 🕶️ Incognito Wachira

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v14+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-black.svg)](https://socket.io/)

**Anonymous Real-Time Chat Application**

A sophisticated anonymous real-time chat platform built with Socket.IO, React, and Node.js. Go incognito and chat securely with advanced features like private messaging, file sharing, message reactions, and more.

![Incognito Wachira Demo](./assets/demo-preview.png)

## 🌟 Project Overview

Incognito Wachira is a modern, feature-rich anonymous chat application that prioritizes user privacy while delivering a seamless real-time communication experience. Built with cutting-edge technologies, it offers enterprise-level features in an intuitive, responsive interface.

### 🎯 Key Highlights
- **100% Anonymous**: No registration required, just pick a username
- **Real-time Everything**: Instant messaging, typing indicators, live notifications
- **Cross-platform**: Works seamlessly on desktop, tablet, and mobile
- **Enterprise Features**: File sharing, message reactions, read receipts
- **Secure**: Built-in security features and rate limiting
- **Scalable**: Optimized Socket.IO implementation with rooms and namespaces

## Features

### Core Features
- ✅ Real-time messaging using Socket.IO
- ✅ User authentication (username-based)
- ✅ Multiple chat rooms
- ✅ Private messaging between users
- ✅ Real-time notifications
- ✅ Online/offline user status
- ✅ Typing indicators
- ✅ Message delivery acknowledgments
- ✅ Message read receipts
- ✅ File sharing capabilities
- ✅ Message reactions
- ✅ Browser notifications
- ✅ Responsive design

### Advanced Features
- ✅ Auto-reconnection logic
- ✅ Message pagination support
- ✅ Unread message counts
- ✅ Sound notifications
- ✅ Connection status indicator
- ✅ Room management
- ✅ Security features (rate limiting, CORS, Helmet)

## Project Structure

```
socketio-chat/
├── client/                 # React front-end
│   ├── public/             # Static files
│   ├── src/                # React source code
│   │   ├── components/     # UI components
│   │   ├── context/        # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   ├── socket/         # Socket.io client setup
│   │   └── App.jsx         # Main application component
│   └── package.json        # Client dependencies
├── server/                 # Node.js back-end
│   ├── config/             # Configuration files
│   ├── controllers/        # Socket event handlers
│   ├── models/             # Data models
│   ├── socket/             # Socket.io server setup
│   ├── utils/              # Utility functions
│   ├── server.js           # Main server file
│   └── package.json        # Server dependencies
└── README.md               # Project documentation
```

## Installation and Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Server Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

The server will run on `http://localhost:5000`

### Client Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

The client will run on `http://localhost:3000`

## Usage

1. **Login**: Enter a username to join the chat
2. **Join Rooms**: Use the sidebar to create or join different chat rooms
3. **Send Messages**: Type in the message input and press Enter or click Send
4. **Private Messages**: Click on a user in the online users list to start a private chat
5. **File Sharing**: Click the 📎 button to share files (images, documents, etc.)
6. **Reactions**: Click on messages to add reactions
7. **Notifications**: Receive in-app and browser notifications for new messages

## Socket.IO Events

### Client to Server Events
- `set_user`: Set user information
- `join_room`: Join a chat room
- `leave_room`: Leave a chat room
- `send_message`: Send a message to a room
- `private_message`: Send a private message
- `typing_start`: Start typing indicator
- `typing_stop`: Stop typing indicator
- `file_share`: Share a file
- `message_reaction`: Add reaction to a message
- `message_read`: Mark message as read

### Server to Client Events
- `message_received`: Receive a new message
- `private_message_received`: Receive a private message
- `user_joined`: User joined a room
- `user_left`: User left a room
- `online_users`: Updated list of online users
- `typing_update`: Typing indicator update
- `message_status_update`: Message status update
- `reaction_added`: New reaction added

## Configuration

### Server Configuration
Edit `server/config/config.js` to customize:
- Port number
- CORS settings
- JWT secret
- File upload limits
- Rate limiting settings

### Client Configuration
Environment variables for the client:
- `REACT_APP_SERVER_URL`: Server URL (default: http://localhost:5000)

## Security Features

- **Rate Limiting**: Prevents spam and abuse
- **CORS Protection**: Configured for specific origins
- **Helmet**: Security headers for Express
- **Input Validation**: Message length limits
- **File Upload Limits**: Size and type restrictions

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Technologies Used

### Frontend
- React 18
- Socket.IO Client
- CSS-in-JS for styling
- Web Notifications API

### Backend
- Node.js
- Express.js
- Socket.IO
- In-memory storage (can be replaced with database)

## Development

### Running in Development Mode
1. Start the server with `npm run dev` for auto-reload
2. Start the client with `npm start`
3. Open multiple browser tabs to test multi-user functionality

### Testing
- Open multiple browser windows/tabs
- Use different usernames to simulate multiple users
- Test features like messaging, typing indicators, and notifications

## Deployment

### Server Deployment
1. Set production environment variables
2. Use a process manager like PM2
3. Configure reverse proxy (Nginx)
4. Set up SSL certificates

### Client Deployment
1. Build the React app: `npm run build`
2. Serve static files from a web server
3. Update `REACT_APP_SERVER_URL` for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Future Enhancements

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] User authentication with JWT
- [ ] Message search functionality
- [ ] Voice/video calling
- [ ] Message encryption
- [ ] Admin controls
- [ ] Mobile app (React Native)
- [ ] Desktop app (Electron)
