import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Profile = () => {
  const [userDetails, setUserDetails] = useState({
    customerId: "",
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    phone: "",
  });
  const [orders, setOrders] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Fetch user details on component mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/profile", {
          credentials: "include", // Include session cookie
        });
        if (response.ok) {
          const data = await response.json();
          setUserDetails({
            customerId: data.CustomerID,
            firstName: data.FirstName,
            lastName: data.LastName,
            email: data.Email,
            address: data.Address,
            phone: data.Phone,
          });
        } else {
          alert("Session expired. Please log in again.");
          window.location.href = "/login"; // Redirect to login page
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []); // Run only once on mount

  // Fetch order logs when customerId changes
  useEffect(() => {
    const fetchOrderLogs = async () => {
      if (!userDetails.customerId) return; // Skip if no customerId is available

      try {
        const response = await fetch(
          `http://localhost:3001/api/orders/customer/${userDetails.customerId}`,
          {
            credentials: "include", // Include session cookie
          }
        );
        if (response.ok) {
          const orderData = await response.json();
          setOrders(orderData);
        } else {
          console.error("Failed to fetch orders");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    if (userDetails.customerId) {
      fetchOrderLogs();
    }
  }, [userDetails.customerId]); // Trigger whenever `customerId` changes

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
    if (e.target.value.length < 7) {
      setPasswordError("Password must be at least 7 characters long.");
    } else {
      setPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSave = async () => {
    if (newPassword && newPassword.length < 7) {
      alert("Password must be at least 7 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const updatedDetails = {
        ...userDetails,
        password: newPassword ? newPassword : undefined,
      };

      const response = await fetch("http://localhost:3001/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include session cookie
        body: JSON.stringify(updatedDetails),
      });

      if (response.ok) {
        alert("Profile updated successfully!");
        setIsEditing(false);
      } else {
        alert("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        alert("Logged out successfully!");
        window.location.href = "/login"; // Redirect to login page
      } else {
        alert("Failed to log out. Please try again.");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <ProfileContainer>
      {/* Left Section */}
      <LeftSection>
        <ProfileImage src="/assets/user.webp" alt="User" />
        <ProfileID>Customer ID: {userDetails.customerId || "N/A"}</ProfileID>
        <div>Name: {userDetails.firstName} {userDetails.lastName}</div>
        <div>Email: {userDetails.email}</div>
        <div>Phone: {userDetails.phone}</div>
      </LeftSection>

      {/* Middle Section (Edit Profile) */}
      <MiddleSection>
        <SectionHeader>Edit Profile</SectionHeader>
        <Form>
          <FormField>
            <Label>First Name:</Label>
            <Input
              type="text"
              name="firstName"
              value={userDetails.firstName}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </FormField>
          <FormField>
            <Label>Last Name:</Label>
            <Input
              type="text"
              name="lastName"
              value={userDetails.lastName}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </FormField>
          <FormField>
            <Label>Phone:</Label>
            <Input
              type="text"
              name="phone"
              value={userDetails.phone}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </FormField>
          <FormField>
            <Label>Address:</Label>
            <Input
              type="text"
              name="address"
              value={userDetails.address}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </FormField>
          <FormField>
            <Label>New Password:</Label>
            <Input
              type="password"
              name="newPassword"
              placeholder="Enter new password"
              value={newPassword}
              onChange={handlePasswordChange}
              disabled={!isEditing}
            />
            {passwordError && <ErrorText>{passwordError}</ErrorText>}
          </FormField>
          <FormField>
            <Label>Confirm Password:</Label>
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              disabled={!isEditing}
            />
          </FormField>
          <FormActions>
            {isEditing ? (
              <>
                <Button onClick={handleSave}>Save</Button>
                <Button cancel onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Edit</Button>
            )}
          </FormActions>
          <FormActions>
            <Button cancel onClick={handleLogout}>Logout</Button>
          </FormActions>
        </Form>
      </MiddleSection>

      {/* Right Section (Order Logs) */}
      <RightSection>
        <SectionHeader>Order Logs</SectionHeader>
        <OrderTable>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Status</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="4">No orders available.</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.OrderID}>
                  <td>{order.OrderID}</td>
                  <td>{order.orderStatus}</td>
                  <td>{order.totalAmount}</td>
                  <td>{order.OrderDate}</td>
                </tr>
              ))
            )}
          </tbody>
        </OrderTable>
      </RightSection>
    </ProfileContainer>
  );
};

export default Profile;

// Styled Components
const ProfileContainer = styled.div`
  display: flex;
  width: 95vw;
  min-height: 100vh;
  background: transparent;
  padding: 20px;
  box-sizing: border-box;
  gap: 20px;
`;

const LeftSection = styled.div`
  flex: 1;
  background: #007bff;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  color: white;
  div {
    font-weight: bold;
  }
`;

const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-bottom: 10px;
`;

const ProfileID = styled.div`
  font-size: 1rem;
  margin-top: 5px;
`;

// const ProfileEmail = styled.div`
//   font-size: 1rem;
//   margin-top: 5px;
//   font-weight: bold;
// `;

const MiddleSection = styled.div`
  flex: 2;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  
`;

// const Detail = styled.div`
//   margin-bottom: 10px;
// `;

const Label = styled.div`
  font-size: 0.9rem;
  color: #555;
  font-weight: bold;
`;

// const Value = styled.div`
//   font-size: 1rem;
//   color: #333;
// `;

const RightSection = styled.div`
  flex: 2;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const SectionHeader = styled.h2`
  margin-bottom: 20px;
  font-size: 1.5rem;
  color: #333;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const ErrorText = styled.div`
  color: #dc3545;
  font-size: 0.8rem;
  margin-top: 5px;
`;

const FormActions = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  /* Ensures that buttons stretch evenly */
  .button-container {
    display: flex;
    gap: 10px;
    width: 100%;
  }
`;


const Button = styled.button`
  padding: 10px 15px;
  font-size: 1rem;
  color: #fff;
  background: ${(props) => (props.cancel ? "#dc3545" : "#007bff")};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  flex-grow: 1; /* Ensures buttons have the same width */
  width: 100%; /* Optional: ensures buttons take up full width of the container */
  
  &:hover {
    background: ${(props) => (props.cancel ? "#c82333" : "#0056b3")};
  }
`;

const OrderTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  th, td {
    padding: 10px;
    border: 1px solid #ddd;
  }
  th {
    background-color: #f4f4f4;
  }
`;

