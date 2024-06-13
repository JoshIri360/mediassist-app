"use client";

import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { useNavigate, BrowserRouter as Router } from 'react-router-dom';

// Define your theme object
const theme = {
  colors: {
    primary: 'blue', // Change this to your desired primary color
    secondary: 'green', // Change this to your desired secondary color
  },
};

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  width: 80%; /* Adjust the width as needed */
  margin: auto;
  background: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Add shadow */
`;

const ProfileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ProfileInfo = styled.div`
  margin-bottom: 10px;
`;

const Label = styled.span`
  font-weight: bold;
`;

const Value = styled.span`
  margin-left: 10px;
`;

const ProfilePicture = styled.img`
  width: 100px; /* Adjust the width as needed */
  height: 100px; /* Adjust the height as needed */
  border-radius: 50%; /* Make it a circle */
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  align-self: center;

  &:hover {
    background-color: ${(props) => props.theme.colors.secondary};
  }
`;

const ProfilePageContent: React.FC = () => {
  const navigate = useNavigate();

  const user = {
    name: 'John Doe',
    dob: '1985-06-15',
    gender: 'Male',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, Anytown USA',
    // Add more user information as needed
    profilePicture: 'https://example.com/profile.jpg', // Example profile picture URL
  };

  const handleEdit = () => {
    navigate('/manageprofile');
  };

  return (
    <ProfileContainer>
      <ProfileHeader>
        <ProfilePicture src={user.profilePicture} alt="Profile Picture" />
        <Button onClick={handleEdit}>Edit Profile</Button>
      </ProfileHeader>

      <h2>Personal Information</h2>
      <ProfileInfo>
        <Label>Name:</Label>
        <Value>{user.name}</Value>
      </ProfileInfo>
      <ProfileInfo>
        <Label>Date of Birth:</Label>
        <Value>{user.dob}</Value>
      </ProfileInfo>
      <ProfileInfo>
        <Label>Gender:</Label>
        <Value>{user.gender}</Value>
      </ProfileInfo>
      <ProfileInfo>
        <Label>Phone:</Label>
        <Value>{user.phone}</Value>
      </ProfileInfo>
      <ProfileInfo>
        <Label>Email:</Label>
        <Value>{user.email}</Value>
      </ProfileInfo>
      <ProfileInfo>
        <Label>Address:</Label>
        <Value>{user.address}</Value>
      </ProfileInfo>
    </ProfileContainer>
  );
};

const ProfilePage: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <ProfilePageContent />
      </Router>
    </ThemeProvider>
  );
};

export default ProfilePage;
