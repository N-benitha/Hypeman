import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import SignUp from './Components/signup';
import LandingPage from './Components/landingPage';
import LogIn from './Components/login';
import DashboardLayout from './Components/dashboardLayout';
import ChatPage from './Components/chatPage';
import DashboardContent from './Components/dashboardContent';
import Favorites from './Components/favorites';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardContent />} />
          <Route path="chats" element={<ChatPage />} />
          <Route path="favorites" element={<Favorites />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App
