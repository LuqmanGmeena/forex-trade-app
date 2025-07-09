import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Initialize Firebase
import './config/firebase';

// Create demo user for testing
const demoUser = {
  id: 'demo-user',
  email: 'demo@forextrade.com',
  password: 'demo123',
  firstName: 'Demo',
  lastName: 'User',
  createdAt: Date.now(),
};

// Initialize demo user in localStorage if not exists
const existingUsers = JSON.parse(localStorage.getItem('forex_users') || '[]');
if (!existingUsers.some((user: any) => user.email === demoUser.email)) {
  existingUsers.push(demoUser);
  localStorage.setItem('forex_users', JSON.stringify(existingUsers));
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);