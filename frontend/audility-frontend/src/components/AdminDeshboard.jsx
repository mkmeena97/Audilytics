import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "../styles/styles.css"; // Import the CSS file

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [validated, setValidated] = useState(false);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const modalRef = useRef(null); // Ref for the modal

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get("http://localhost:8080/api/users/admin", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsers(response.data);
      } catch (err) {
        setError("Failed to load users.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle user validation action
  const handleValidate = async (userId) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.put(
        `http://localhost:8080/api/users/admin/validate/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Update the user's validated status locally
      setUsers(users.map((user) => (user.id === userId ? { ...user, validated: true } : user)));
      setValidated(true);
    } catch (err) {
      console.error(err);
      setError("Failed to validate user.");
    }
  };

  // Select user for detailed view and show modal
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setValidated(user.validated);
    setShowModal(true); // Show the modal
  };

  // Close modal when clicking outside
  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setShowModal(false); // Hide the modal
    }
  };

  // Add event listener for clicking outside the modal
  useEffect(() => {
    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);

  // Mask sensitive details
  const maskData = (data, type) => {
    if (!data) return "N/A";
    switch (type) {
      case "phone":
        return data; // Mask all but last 4 digits
      case "street":
        return data.split(" ").slice(0, 2).map(() => "*****").join(" ") + " " + data.split(" ").slice(2).join(" ");
      default:
        return data;
    }
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="adminContainer">
      <h2 className="adminTitle">Admin Dashboard</h2>
      <div className="adminTableContainer">
        <table className="adminTable">
          <thead>
            <tr>
              <th>Username</th>
              <th>Validated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.validated ? "Yes" : "No"}</td>
                <td>
                  <button className="viewButton" onClick={() => handleUserSelect(user)}>
                    View
                  </button>
                  {!user.validated && (
                    <button className="validateButton" onClick={() => handleValidate(user.id)}>
                      Validate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for user details */}
      {showModal && selectedUser && (
        <div className="modalOverlay">
          <div className="userDetailsCard" ref={modalRef}>
            <h3 className="detailsTitle">User Details</h3>
            <p>
              <strong>Username:</strong> {selectedUser.username}
            </p>
            <p>
              <strong>Full Name:</strong> {selectedUser.firstName} {selectedUser.lastName}
            </p>
            <p>
              <strong>Email:</strong> {selectedUser.email}
            </p>
            <p>
              <strong>Phone:</strong> {maskData(selectedUser.phone, "phone")}
            </p>
            <p>
              <strong>Address:</strong> {maskData(selectedUser.street, "address")}
            </p>
            <p>
              <strong>Country:</strong> {selectedUser.country || "N/A"}
            </p>
            <p>
              <strong>State:</strong> {selectedUser.state || "N/A"}
            </p>
            <p>
              <strong>City:</strong> {selectedUser.city || "N/A"}
            </p>
            <p>
              <strong>Postal Code:</strong> {selectedUser.postalCode || "N/A"}
            </p>
            <p>
              <strong>Date of Birth:</strong> {selectedUser.dob || "N/A"}
            </p>
            <p>
              <strong>Role:</strong> {selectedUser.role || "N/A"}
            </p>

            <label className="checkboxContainer">
  <input
    type="checkbox"
    checked={validated}
    onChange={(e) => setValidated(e.target.checked)}
    disabled={selectedUser.validated}
  />
  <span className="customCheckbox"></span>
  Mark as Validated
</label>

            {!selectedUser.validated && (
              <button className="validateButton" onClick={() => handleValidate(selectedUser.id)}>
                Validate
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;