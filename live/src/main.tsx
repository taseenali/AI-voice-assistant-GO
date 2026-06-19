import React from 'react';
import ReactDOM from 'react-dom/client';
import './monitor.css';
import LiveMonitor from './LiveMonitor';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LiveMonitor />
  </React.StrictMode>
);
