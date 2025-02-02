import React, { useEffect, useState } from "react";
import "../styles/styles.css";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const storedUserData = localStorage.getItem("user");
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
      setFormData(parsedUserData); // Initialize form with existing user data
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("Access token not found");
        return;
      }
  
      // Remove password field from formData before sending request
      const { password, ...updatedData } = formData;
  
      const response = await fetch(
        `http://localhost:8080/api/users/update/${userData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(updatedData), // Send only updated data without password
        }
      );
  
      if (response.ok) {
        const updatedUser = await response.json();
        setUserData(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setIsEditing(false);
      } else {
        console.error("Failed to update user details");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };
  

  if (!userData) return <div className="loading">Loading...</div>;

  return (
    <div className="profileContainer">
      <div className="profileCard">
        <h2 className="profileTitle">User Profile</h2>

        {!isEditing ? (
          <>
            <div className="profileDetails">
              <div className="profileField">
                <span className="profileLabel">Username:</span>
                <span className="profileValue">{userData.username}</span>
              </div>
              <div className="profileField">
                <span className="profileLabel">Full Name:</span>
                <span className="profileValue">
                  {userData.firstName} {userData.lastName}
                </span>
              </div>
              <div className="profileField">
                <span className="profileLabel">Email:</span>
                <span className="profileValue">{userData.email}</span>
              </div>
              <div className="profileField">
                <span className="profileLabel">Phone:</span>
                <span className="profileValue">{userData.phone}</span>
              </div>
              <div className="profileField">
                <span className="profileLabel">Country:</span>
                <span className="profileValue">{userData.country}</span>
              </div>
              <div className="profileField">
                <span className="profileLabel">State:</span>
                <span className="profileValue">{userData.state}</span>
              </div>
              <div className="profileField">
                <span className="profileLabel">City:</span>
                <span className="profileValue">{userData.city}</span>
              </div>
              <div className="profileField">
                <span className="profileLabel">Street:</span>
                <span className="profileValue">{userData.street}</span>
              </div>
              <div className="profileField">
                <span className="profileLabel">Date of Birth:</span>
                <span className="profileValue">{userData.dob}</span>
              </div>
            </div>
            <button className="editButton" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          </>
        ) : (
          <form className="editForm" onSubmit={handleSubmit}>
            <label>
              Username:
              <input
                type="text"
                name="username"
                className="editForm input"
                value={formData.username}
                onChange={handleChange}
              />
            </label>
            <label>
              Full Name:
              <input
                type="text"
                name="firstName"
                className="editForm input"
                value={formData.firstName}
                onChange={handleChange}
              />
              <input
                type="text"
                name="lastName"
                className="editForm input"
                value={formData.lastName}
                onChange={handleChange}
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={formData.email}
                className="editForm input"
                onChange={handleChange}
              />
            </label>
            <label>
              Phone:
              <input
                type="text"
                name="phone"
                value={formData.phone}
                className="editForm input"
                onChange={handleChange}
              />
            </label>
            <label>
              Country:
              <input
                type="text"
                name="country"
                className="editForm input"
                value={formData.country}
                onChange={handleChange}
              />
            </label>
            <label>
              State:
              <input
                type="text"
                name="state"
                className="editForm input"
                value={formData.state}
                onChange={handleChange}
              />
            </label>
            <label>
              City:
              <input
                type="text"
                name="city"
                className="editForm input"
                value={formData.city}
                onChange={handleChange}
              />
            </label>
            <label>
              Street:
              <input
                type="text"
                name="street"
                className="editForm input"
                value={formData.street}
                onChange={handleChange}
              />
            </label>
            <label>
              Date of Birth:
              <input
                type="date"
                name="date_of_birth"
                className="editForm input"
                value={formData.dob}
                onChange={handleChange}
              />
            </label>
            <div className="buttonContainer">
              <button type="submit" className="saveButton">
                Save
              </button>
              <button
                type="button"
                className="cancelButton"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserProfile;