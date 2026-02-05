import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { DataProvider } from './context/DataContext'; // 👈 BU MUHIM
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <DataProvider>  {/* 👈 ENGMUHIM JOYI SHU */}
        <App />
      </DataProvider>
    </BrowserRouter>
  </React.StrictMode>,
);