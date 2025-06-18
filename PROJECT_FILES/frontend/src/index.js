import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // ✅ Ensure this matches your file name

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
