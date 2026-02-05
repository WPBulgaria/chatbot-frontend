import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './global.css';
import { appContainerId } from './lib/constants';

const rootElement = document.getElementById(appContainerId);
if (!rootElement) {
  throw new Error('Failed to find the root element');
}


if (process.env.NODE_ENV === 'development') {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {

  const shadow = rootElement.attachShadow({ mode: "open" });
  const css = (window as any).wpbChatbotConfig?.cssUrl;

  if (css) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = css;
    shadow.prepend(link);
  }

  ReactDOM.createRoot(shadow).render(
    <React.StrictMode>
      <App 
        history={rootElement.getAttribute('data-history') !== 'off'} 
      />
    </React.StrictMode>
  );
}