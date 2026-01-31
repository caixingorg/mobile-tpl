import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './assets/styles/index.css';

// 初始化主题
const initTheme = () => {
  const savedTheme = sessionStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
};

initTheme();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
