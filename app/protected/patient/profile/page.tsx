"use client";

import React, { useState } from 'react';
import styled from 'styled-components';

const UserProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  max-width: 600px;
  margin: auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 24px;
  color: #0070f3; // Replace with your primary color
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 8px;
  font-weight: bold;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc; // Replace with your border color
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #0070f3; // Replace with your primary color
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #005bb5; // Replace with your secondary color
  }
`;

const UserProfile: React.FC = () => {
  const [user, setUser] = useState({
    name: '',
    dob: '',
    email: '',
    phone: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('User Profile:', user);
    // Handle profile update logic here
  };

  return (
    <UserProfileContainer>
      <Title>Manage Your Profile</Title>
      <Form onSubmit={handleSubmit}>
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          name="name"
          value={user.name}
          onChange={handleChange}
          required
        />

        <Label htmlFor="dob">Date of Birth</Label>
        <Input
          type="date"
          id="dob"
          name="dob"
          value={user.dob}
          onChange={handleChange}
          required
        />

        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          name="email"
          value={user.email}
          onChange={handleChange}
          required
        />

        <Label htmlFor="phone">Phone Number</Label>
        <Input
          type="tel"
          id="phone"
          name="phone"
          value={user.phone}
          onChange={handleChange}
          required
        />

        <Button type="submit">Save Changes</Button>
      </Form>
    </UserProfileContainer>
  );
};

export default UserProfile;
