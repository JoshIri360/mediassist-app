"use client";

import React, { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { useNavigate, BrowserRouter as Router } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io'; // Import the icon



const theme = {
  colors: {
    primary: '#6200ea',
    secondary: '#3700b3',
  },
};

const Container = styled.div`
  display: flex;
  height: 100vh;
  padding: 20px; // Add padding to the container to provide spacing around the sidebar
  box-sizing: border-box; // Ensure padding is included in the element's total width and height
`;

const Sidebar = styled.div`
  flex: 1.2;  // Increase the width of the sidebar
  background: #121063;
  border-radius: 10px;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px;
  margin-right: 20px; // Add space to the right of the sidebar
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); // Optional: Add a shadow for better visual separation
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
  flex: 1.8;  // Decrease the width of the form container
  display: flex;
  flex-direction: column;
  justify-content: flex-start;  // Raise the form higher
  padding: 40px;
  background: white;
  border-radius: 10px; // Match the sidebar's border radius
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); // Optional: Add a shadow for better visual separation
`;

const BackArrow = styled(IoIosArrowBack)`
  cursor: pointer;
  font-size: 1.5rem;
  color: #6b6b6b;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-size: 1.5rem;  // Smaller text
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  font-size: 0.9rem;  // Smaller text
  color: #6b6b6b;
  margin-bottom: 20px;  // Adjust margin
`;

const ProgressBar = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  span {
    font-size: 0.8rem;  // Smaller text
    color: #6b6b6b;
  }

  div {
    flex: 1;
    height: 4px;
    background-color: #e0e0e0;
    margin-left: 10px;
    margin-right: 10px;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      height: 4px;
      width: 50%; /* Adjust based on step */
      background-color: ${(props) => props.theme.colors.primary};
    }
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;

  label {
    margin-bottom: 8px;  // Adjust margin
    font-size: 0.9rem;  // Smaller text
    color: #6b6b6b;
  }

  input {
    margin-bottom: 15px;  // Adjust margin
    padding: 8px;  // Adjust padding
    font-size: 0.9rem;  // Smaller text
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  button {
    padding: 8px;  // Smaller button
    font-size: 0.9rem;  // Smaller text
    background-color: ${(props) => props.theme.colors.primary};
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 4px;

    &:hover {
      background-color: ${(props) => props.theme.colors.secondary};
    }
  }
`;


const OnboardingStep1Content: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
    familyHistory: '',
    immunization: '',
    allergies: '',
  });

  const [currentStep, setCurrentStep] = useState(1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const Step1Form = () => {
    return (
      <Form onSubmit={handleSubmit}>
        <label>Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        <label>Age</label>
        <input type="number" name="age" value={formData.age} onChange={handleChange} required />
        <label>Weight (kg)</label>
        <input type="number" name="weight" value={formData.weight} onChange={handleChange} required />
        <button type="submit">Next</button>
      </Form>
    );
  };
  
  const Step2Form = () => {
    return (
      <Form onSubmit={handleSubmit}>
        <label>Family Medical History</label>
        <textarea name="familyHistory" value={formData.familyHistory} onChange={handleChange} required />
        <label>Immunization Records</label>
        <textarea name="immunization" value={formData.immunization} onChange={handleChange} required />
        <label>Allergies</label>
        <textarea name="allergies" value={formData.allergies} onChange={handleChange} required />
        <button type="submit">Submit</button>
      </Form>
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentStep === 1) {
      setCurrentStep(2);
    } else{
    localStorage.setItem('onboardingData', JSON.stringify(formData));
    console.log(formData);
  }};

  return (
    <Container>
      <Sidebar>
        <h1>Elevate your workflow with MediCare</h1>
        <p>Elevate your workflow with Fremen. Elevate your workflow with Fremen. Elevate your workflow with Fremen. Elevate your workflow with Fremen.</p>
      </Sidebar>
      <FormContainer>
        <BackArrow onClick={() => navigate(-1)} />
        <Title>Patient Onboarding</Title>
        <Subtitle>{currentStep === 1 ? 'Please enter your personal details' : 'Please provide your medical history'}</Subtitle>
        <ProgressBar>
          <span>{currentStep} of 2</span>
          <div></div>
        </ProgressBar>
        {currentStep === 1 ? <Step1Form /> : <Step2Form />}
      </FormContainer>
    </Container>
  );
};

const OnboardingStep1: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <OnboardingStep1Content />
      </Router>
    </ThemeProvider>
  );
};

export default OnboardingStep1;