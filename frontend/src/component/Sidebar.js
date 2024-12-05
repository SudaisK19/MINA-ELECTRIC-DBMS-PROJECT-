import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

/* Sidebar container */
const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: calc(100% - 80px);
  width: 250px;
  background-color: rgba(204, 204, 204, 0.8); /* Light gray with transparency */
  color: #333;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  margin-top: 88px; /* Adjust for fixed header */
`;

/* Sidebar links */
const SidebarList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SidebarListItem = styled.li`
  margin: 15px 0;
`;

const SidebarLink = styled(Link)`
  display: flex;
  align-items: center;
  color: darkslategrey;
  text-decoration: none;
  font-size: 1rem;
  padding: 10px;
  border-radius: 4px;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: var(--primary-color);
    color: white;
  }
`;

const Icon = styled.i`
  margin-right: 10px;
  font-size: 1.2rem;
`;

/* Logout Button */
const LogoutButton = styled(Link)`
  display: block;
  color: white;
  text-decoration: none;
  font-size: 1rem;
  padding: 12px 20px;
  border-radius: 4px;
  background-color: #dc3545; /* Red background */
  margin-top: 200px; /* Push the button to the bottom */
  text-align: center;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: darkred; /* Darker red on hover */
  }
`;

const Sidebar = () => {
  return (
    <SidebarContainer>
      <SidebarList>
        <SidebarListItem>
          <SidebarLink to="/adminDashboard">
            <Icon className="fas fa-tachometer-alt"></Icon> Dashboard
          </SidebarLink>
        </SidebarListItem>
        <SidebarListItem>
          <SidebarLink to="/adminDashboard/products">
            <Icon className="fas fa-box"></Icon> Products
          </SidebarLink>
        </SidebarListItem>
        <SidebarListItem>
          <SidebarLink to="/adminDashboard/categories">
            <Icon className="fas fa-tags"></Icon> Categories
          </SidebarLink>
        </SidebarListItem>
        <SidebarListItem>
          <SidebarLink to="/adminDashboard/orders">
            <Icon className="fas fa-shopping-cart"></Icon> Orders
          </SidebarLink>
        </SidebarListItem>
        <SidebarListItem>
          <SidebarLink to="/adminDashboard/customers">
            <Icon className="fas fa-users"></Icon> Customers
          </SidebarLink>
        </SidebarListItem>
        <SidebarListItem>
          <SidebarLink to="/adminDashboard/reviews">
            <Icon className="fas fa-comments"></Icon> Reviews
          </SidebarLink>
        </SidebarListItem>
      </SidebarList>

      {/* Logout Button */}
      <LogoutButton to="/login">
        Logout
      </LogoutButton>
    </SidebarContainer>
  );
};

export default Sidebar;
