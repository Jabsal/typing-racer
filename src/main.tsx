import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Entry point for the Vite + React application.  This file
// bootstraps React into the DOM and applies StrictMode to help
// surface common bugs during development.  See App.tsx for the
// implementation of the typing racer game.

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);