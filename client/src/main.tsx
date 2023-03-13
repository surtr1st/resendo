import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { useAuth } from './services';
import { LoginOrRegistrate } from './views/LoginOrRegistrate';

const { isAuth } = useAuth()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {!isAuth ? <LoginOrRegistrate /> : <App />}
  </React.StrictMode>,
);
