import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Homepage from './pages/Homepage';
import UserDashboard from './pages/UserDashboard';
import CreateRecipe from './pages/CreateRecipe';
import Community from './pages/Community';
import Login from './pages/Login';
import Register from './pages/Register';
import { Toaster } from 'react-hot-toast';
import { getUserProfile } from './api';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getUserProfile()
        .then((res) => setUser(res.data))
        .catch(() => localStorage.removeItem('token'));
    }
  }, []);

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={user ? <UserDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/create"
          element={user ? <CreateRecipe /> : <Navigate to="/login" />}
        />
        <Route path="/community" element={<Community />} />
      </Routes>
    </Router>
  );
}

export default App;