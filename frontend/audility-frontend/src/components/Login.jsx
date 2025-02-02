import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/styles.css"; // Import the CSS file

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(
        "/users/login", 
        { username, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Ensure credentials are sent
        }
      );
      
      // Store the token and user data in localStorage
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));  // Store the user data

      // Check if the user is an admin or a regular user
      const userRole = response.data.user.role;
      if (userRole === "ADMIN") {
        navigate("/admin");
      } else if (userRole === "USER") {
        navigate("/profile");
      } else {
        setError("User role is not recognized.");
      }
    } catch (err) {
      if (err.response) {
        console.error("Error response:", err.response.data);
      }
      setError("Invalid credentials");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="title">Login</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleLogin} className="form">
          <div className="formGroup">
            <label className="label">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input"
              required
            />
          </div>
          <div className="formGroup">
            <label className="label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              required
            />
          </div>
          <button type="submit" className="button">
            Login
          </button>
        </form>
        <p className="text">
          Don't have an account?{" "}
          <button onClick={() => navigate("/register")} className="link">
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
