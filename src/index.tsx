import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './global.css';

const rootElement = document.getElementById(process.env.NODE_ENV === 'development' ? 'botui-app' : 'wp-chatbot-chat-container');
if (!rootElement) {
  throw new Error('Failed to find the root element');
}


ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);