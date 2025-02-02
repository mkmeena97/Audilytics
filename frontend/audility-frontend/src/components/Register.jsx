import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/styles.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    dob: "",
    phone: "",
    email: "",
    street: "",
    postalCode: "",
    country: "", // Will store country name
    state: "", // Will store state name
    city: "",
    role: "USER", // Default role is USER
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [error, setError] = useState("");
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [countryCode, setCountryCode] = useState(""); 
  const [stateCode, setStateCode] = useState(""); 
  const navigate = useNavigate();

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      setLoadingCountries(true);
      try {
        const response = await axios.get("http://localhost:8080/api/address/countries");
        setCountries(response.data);
      } catch (error) {
        setError("Error fetching countries. Please try again later.");
      } finally {
        setLoadingCountries(false);
      }
    };
    fetchCountries();
  }, []);

  const handleCountryChange = async (e) => {
    const selectedCountryCode = e.target.value;
    const selectedCountry = countries.find((country) => country.countryCode === selectedCountryCode);
  
    // Update formData with country name
    setFormData({
      ...formData,
      country: selectedCountry ? selectedCountry.countryName : "",
      state: "",
      city: "",
    });
  
    // Update temporary country code
    setCountryCode(selectedCountryCode);
  
    setStates([]);
    setCities([]);
  
    if (selectedCountryCode) {
      setLoadingStates(true);
      try {
        const response = await axios.get(
          `http://localhost:8080/api/address/states/${selectedCountryCode}`
        );
        setStates(response.data);
      } catch (error) {
        setError("Error fetching states. Please try again later.");
      } finally {
        setLoadingStates(false);
      }
    }
  };

  const handleStateChange = async (e) => {
    const selectedStateCode = e.target.value;
    const selectedState = states.find((state) => state.stateCode === selectedStateCode);
  
    // Update formData with state name
    setFormData({
      ...formData,
      state: selectedState ? selectedState.stateName : "",
      city: "",
    });
  
    // Update temporary state code
    setStateCode(selectedStateCode);
  
    setCities([]);
  
    if (countryCode && selectedStateCode) {
      setLoadingCities(true);
      try {
        const response = await axios.get(
          `http://localhost:8080/api/address/cities/${countryCode}/${selectedStateCode}`
        );
        setCities(response.data);
      } catch (error) {
        setError("Error fetching cities. Please try again later.");
      } finally {
        setLoadingCities(false);
      }
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validation functions
  const validateName = (name) => {
    const nameRegex = /^[A-Za-z\s]+$/; // Only letters and spaces allowed
    return nameRegex.test(name);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\d+$/; // Only numbers allowed
    return phoneRegex.test(phone);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/; // At least one letter, one number, no special characters
    return passwordRegex.test(password);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    if (
      !formData.username ||
      !formData.password ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.dob ||
      !formData.phone ||
      !formData.email ||
      !formData.street ||
      !formData.postalCode ||
      !formData.country ||
      !formData.state ||
      !formData.city ||
      !formData.role
    ) {
      setError("All fields are required.");
      return;
    }

    // Validate first name and last name
    if (!validateName(formData.firstName) || !validateName(formData.lastName)) {
      setError("Name should not contain numbers or special characters.");
      return;
    }

    // Validate phone number
    if (!validatePhone(formData.phone)) {
      setError("Phone number should contain only numbers.");
      return;
    }

    // Validate password
    if (!validatePassword(formData.password)) {
      setError("Password must contain at least one letter and one number, and no special characters.");
      return;
    }

    // Submit form data
    try {
      const response = await axios.post("http://localhost:8080/api/users/register", formData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // Ensure credentials are sent
      });

      if (response.status === 200) {
        navigate("/login");
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Registration failed. Please try again.");
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="title">Register</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit} className="form">
          {/* Username */}
          <div className="formGroup">
            <label className="label">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          {/* Password */}
          <div className="formGroup">
            <label className="label">Password</label>
            <input
              type="password" // Password masking
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          {/* First Name */}
          <div className="formGroup">
            <label className="label">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          {/* Last Name */}
          <div className="formGroup">
            <label className="label">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          {/* Date of Birth */}
          <div className="formGroup">
            <label className="label">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          {/* Phone Number */}
          <div className="formGroup">
            <label className="label">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          {/* Email */}
          <div className="formGroup">
            <label className="label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          {/* Street */}
          <div className="formGroup">
            <label className="label">Street</label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          {/* Postal Code */}
          <div className="formGroup">
            <label className="label">Postal Code</label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

{/* Country */}
<div className="formGroup">
  <label className="label">Country</label>
  <select
    name="countryCode"
    value={countryCode}
    onChange={handleCountryChange}
    className="input"
    required
  >
    <option value="">Select Country</option>
    {countries.map((country) => (
      <option key={country.countryCode} value={country.countryCode}>
        {country.countryName}
      </option>
    ))}
  </select>
  {loadingCountries && <p>Loading countries...</p>}
</div>

{/* State */}
<div className="formGroup">
  <label className="label">State</label>
  <select
    name="stateCode"
    value={stateCode}
    onChange={handleStateChange}
    className="input"
    required
  >
    <option value="">Select State</option>
    {states.map((state) => (
      <option key={state.stateCode} value={state.stateCode}>
        {state.stateName}
      </option>
    ))}
  </select>
  {loadingStates && <p>Loading states...</p>}
</div>

          {/* City */}
          <div className="formGroup">
            <label className="label">City</label>
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            {loadingCities && <p>Loading cities...</p>}
          </div>

          {/* Role */}
          <div className="formGroup">
            <label className="label">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          {/* Submit Button */}
          <button type="submit" className="button">
            Submit
          </button>
        </form>
        <p className="text">
          Already have an account?{" "}
          <button onClick={() => navigate("/login")} className="link">
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;