import React from 'react';
import { ChatProvider } from './context/ChatContext';
import Login from './pages/Login';
import Chat from './pages/Chat';
import { useChat } from './context/ChatContext';

const AppContent = () => {
  const { state } = useChat();

  return (
    <div className="app">
      {state.user ? <Chat /> : <Login />}
    </div>
  );
};

const App = () => {
  return (
    <ChatProvider>
      <AppContent />
    </ChatProvider>
  );
};

export default App;
