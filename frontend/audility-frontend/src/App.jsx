import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import "./styles/styles.css"; // Import the CSS file

// Lazy load components for better performance
const Login = lazy(() => import("./components/Login.jsx"));
const Register = lazy(() => import("./components/Register.jsx"));
const UserProfile = lazy(() => import("./components/UserProfile.jsx"));
const AdminDashboard = lazy(() => import("./components/AdminDeshboard.jsx"));

// Configure axios to allow credentials (Important for CORS with cookies)
axios.defaults.baseURL = "http://localhost:8080/api";
axios.defaults.withCredentials = true;

const App = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} /> {/* Redirect unknown routes */}
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;