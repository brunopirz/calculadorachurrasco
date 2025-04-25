import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './style.css';
import '@fortawesome/fontawesome-svg-core/styles.css'; // Import Font Awesome CSS
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported above

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
