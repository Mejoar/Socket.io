import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import socketService from '../socket/socket';

const ChatContext = createContext();

const initialState = {
  user: null,
  currentRoom: 'general',
  messages: {},
  users: {},
  typingUsers: {},
  notifications: [],
  unreadCounts: {},
  rooms: ['general'],
  privateChats: {},
  onlineUsers: [],
  connectionStatus: 'disconnected',
};

const chatReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'SET_CONNECTION_STATUS':
      return { ...state, connectionStatus: action.payload };
    
    case 'SET_CURRENT_ROOM':
      return { ...state, currentRoom: action.payload };
    
    case 'ADD_MESSAGE':
      const { room, message } = action.payload;
      return {
        ...state,
        messages: {
          ...state.messages,
          [room]: [...(state.messages[room] || []), message],
        },
      };
    
    case 'SET_MESSAGES':
      return {
        ...state,
        messages: { ...state.messages, [action.payload.room]: action.payload.messages },
      };
    
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, { ...action.payload, id: uuidv4() }],
      };
    
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      };
    
    case 'SET_ONLINE_USERS':
      return { ...state, onlineUsers: action.payload };
    
    case 'SET_TYPING_USERS':
      return {
        ...state,
        typingUsers: { ...state.typingUsers, [action.payload.room]: action.payload.users },
      };
    
    case 'INCREMENT_UNREAD':
      const roomName = action.payload;
      return {
        ...state,
        unreadCounts: {
          ...state.unreadCounts,
          [roomName]: (state.unreadCounts[roomName] || 0) + 1,
        },
      };
    
    case 'RESET_UNREAD':
      return {
        ...state,
        unreadCounts: { ...state.unreadCounts, [action.payload]: 0 },
      };
    
    case 'ADD_ROOM':
      return {
        ...state,
        rooms: [...state.rooms, action.payload],
      };
    
    case 'ADD_PRIVATE_CHAT':
      return {
        ...state,
        privateChats: { ...state.privateChats, [action.payload.id]: action.payload },
      };
    
    case 'UPDATE_MESSAGE_STATUS':
      const { roomId, messageId, status } = action.payload;
      return {
        ...state,
        messages: {
          ...state.messages,
          [roomId]: state.messages[roomId]?.map(msg =>
            msg.id === messageId ? { ...msg, status } : msg
          ) || [],
        },
      };
    
    case 'ADD_REACTION':
      const { roomId: reactionRoom, messageId: reactionMsgId, reaction } = action.payload;
      return {
        ...state,
        messages: {
          ...state.messages,
          [reactionRoom]: state.messages[reactionRoom]?.map(msg =>
            msg.id === reactionMsgId
              ? {
                  ...msg,
                  reactions: { ...msg.reactions, [reaction.type]: [...(msg.reactions?.[reaction.type] || []), reaction.user] }
                }
              : msg
          ) || [],
        },
      };
    
    default:
      return state;
  }
};

export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  useEffect(() => {
    if (state.user) {
      const socket = socketService.connect();
      
      socket.on('connect', () => {
        dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'connected' });
        // Send user data to server
        socket.emit('set_user', state.user);
      });
      
      socket.on('disconnect', () => {
        dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'disconnected' });
      });
      
      socket.on('message_received', (data) => {
        dispatch({ type: 'ADD_MESSAGE', payload: data });
        if (data.room !== state.currentRoom) {
          dispatch({ type: 'INCREMENT_UNREAD', payload: data.room });
        }
        // Add notification for new message
        dispatch({ 
          type: 'ADD_NOTIFICATION', 
          payload: { 
            type: 'message', 
            message: `New message from ${data.message.sender}`,
            room: data.room
          } 
        });
      });
      
      socket.on('user_joined', (data) => {
        dispatch({ 
          type: 'ADD_NOTIFICATION', 
          payload: { 
            type: 'user_joined', 
            message: `${data.user} joined ${data.room}`,
            room: data.room
          } 
        });
      });
      
      socket.on('user_left', (data) => {
        dispatch({ 
          type: 'ADD_NOTIFICATION', 
          payload: { 
            type: 'user_left', 
            message: `${data.user} left ${data.room}`,
            room: data.room
          } 
        });
      });
      
      socket.on('online_users', (users) => {
        dispatch({ type: 'SET_ONLINE_USERS', payload: users });
      });
      
      socket.on('typing_update', (data) => {
        dispatch({ type: 'SET_TYPING_USERS', payload: data });
      });
      
      socket.on('private_message_received', (data) => {
        dispatch({ type: 'ADD_MESSAGE', payload: { room: data.chatId, message: data.message } });
        dispatch({ 
          type: 'ADD_NOTIFICATION', 
          payload: { 
            type: 'private_message', 
            message: `Private message from ${data.message.sender}`,
            room: data.chatId
          } 
        });
      });
      
      socket.on('message_status_update', (data) => {
        dispatch({ type: 'UPDATE_MESSAGE_STATUS', payload: data });
      });
      
      socket.on('reaction_added', (data) => {
        dispatch({ type: 'ADD_REACTION', payload: data });
      });
      
      return () => {
        socketService.disconnect();
      };
    }
  }, [state.user, state.currentRoom]);

  const value = {
    state,
    dispatch,
    // Helper functions
    sendMessage: (text, room = state.currentRoom) => {
      const message = {
        id: uuidv4(),
        text,
        sender: state.user.username,
        timestamp: new Date().toISOString(),
        room,
        status: 'sent',
      };
      dispatch({ type: 'ADD_MESSAGE', payload: { room, message } });
      socketService.sendMessage({ message, room });
    },
    
    joinRoom: (room) => {
      dispatch({ type: 'SET_CURRENT_ROOM', payload: room });
      dispatch({ type: 'RESET_UNREAD', payload: room });
      socketService.joinRoom(room);
    },
    
    sendPrivateMessage: (recipientId, text) => {
      const chatId = [state.user.id, recipientId].sort().join('_');
      const message = {
        id: uuidv4(),
        text,
        sender: state.user.username,
        timestamp: new Date().toISOString(),
        status: 'sent',
      };
      dispatch({ type: 'ADD_MESSAGE', payload: { room: chatId, message } });
      socketService.sendPrivateMessage({ recipientId, message, chatId });
    },
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
