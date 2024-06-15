"use client";

import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  height: 100vh;
`;

const Sidebar = styled.div`
  flex: 1;
  background: #121063;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px;
  text-align: center;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 20px;
  }

  p {
    font-size: 1.2rem;
    margin-top: 10px;
  }
`;

const FormContainer = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px;
  background: white;
`;

const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 20px;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 20px;
  color: #6b6b6b;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;

  label {
    margin-bottom: 10px;
  }

  input {
    margin-bottom: 20px;
    padding: 10px;
    font-size: 1rem;
  }

  button {
    padding: 10px;
    font-size: 1rem;
    background-color: #6200ea;
    color: white;
    border: none;
    cursor: pointer;

    &:hover {
      background-color: #3700b3;
    }
  }
`;

const OnboardingStep1 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Store form data in localStorage or state management
    localStorage.setItem('onboardingData', JSON.stringify(formData));
    navigate('/onboarding-step2');
  };

  return (
    <Container>
      <Sidebar>
        <h1>Elevate your workflow with MediCare</h1>
        <p>Elevate your workflow with Fremen. Elevate your workflow with Fremen. Elevate your workflow with Fremen. Elevate your workflow with Fremen.</p>
      </Sidebar>
      <FormContainer>
        <Title>Patient Onboarding</Title>
        <Subtitle>Please enter your personal details</Subtitle>
        <Form onSubmit={handleSubmit}>
          <label>Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          <label>Age</label>
          <input type="number" name="age" value={formData.age} onChange={handleChange} required />
          <label>Weight (kg)</label>
          <input type="number" name="weight" value={formData.weight} onChange={handleChange} required />
          <button type="submit">Next</button>
        </Form>
      </FormContainer>
    </Container>
  );
};

export default OnboardingStep1;
