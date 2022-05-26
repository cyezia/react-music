import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // Stric Mode 严格模式
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// reportWebVitals();
