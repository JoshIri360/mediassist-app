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
  flex-direction: column; /* Change to column to stack header and content */
  padding: 20px;
  width: 100%; /* Set width to 100% of viewport width */
  margin: 0; /* Remove default margin */
  background: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow-x: hidden; /* Prevent horizontal overflow */
`;

const ProfileContent = styled.div`
  display: flex;
  flex-direction: row; /* Row for side-by-side layout */
  justify-content: space-between; /* Evenly distribute children */
`;

const Header = styled.h1`
  text-align: center;
  width: 100%;
  margin-bottom: 20px;
`;

const Section = styled.div`
  flex: 1;
  margin: 0 10px;
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

  const TableContainer = styled.div`
  margin: 20px 0;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
`;

const TableHeader = styled.th`
  border-bottom: 1px solid #ddd;
  padding: 8px;
  text-align: left;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const TableCell = styled.td`
  border-bottom: 1px solid #ddd;
  padding: 8px;
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
    profilePicture: 'https://example.com/profile.jpg', // Example profile picture URL
  };

  const medicalHistory = {
    bloodType: 'O+',
    allergies: ['Pollen', 'Penicillin'],
    chronicConditions: ['Asthma', 'Hypertension'],
    pastSurgeries: [
      {
        surgery: 'Appendectomy',
        year: 2010
      }
    ],
    immunizations: ['Flu', 'Pneumonia', 'Tetanus'],
  };

  const currentMedications = [
    { medication: 'Lisinopril', dosage: '10mg', frequency: 'Daily', startDate: '2022-03-15' },
    { medication: 'Metformin', dosage: '500mg', frequency: 'Twice Daily', startDate: '2021-09-01' },
    { medication: 'Albuterol', dosage: '90mcg', frequency: 'As Needed', startDate: '2020-11-20' },
  ];

  const pastMedications = [
    { medication: 'Atorvastatin', dosage: '20mg', frequency: 'Daily', startDate: '2019-06-01', endDate: '2021-05-31' },
    { medication: 'Ibuprofen', dosage: '200mg', frequency: 'As Needed', startDate: '2018-02-15', endDate: '2019-01-31' },
  ];

  return (
    <ProfileContainer>
      <Header style={{ textAlign: 'left', fontSize: '2em', fontWeight: 'bold' }}>Patient Medical Profile</Header>
      <hr style={{ borderColor: '#f2f2f2', borderWidth: '0.5px' }} />
      <br></br>
      <ProfileContent>
        <Section>
          <h2 style={{fontWeight:"bold"}}>Personal Information</h2>
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
        </Section>
        <Section>
          <h2 style={{fontWeight:"bold"}}>Medical History</h2>
          <ProfileInfo>
            <Label>Blood Type:</Label>
            <Value>{medicalHistory.bloodType}</Value>
          </ProfileInfo>
          <ProfileInfo>
            <Label>Allergies:</Label>
            <Value>{medicalHistory.allergies.join(', ')}</Value>
          </ProfileInfo>
          <ProfileInfo>
            <Label>Chronic Conditions:</Label>
            <Value>{medicalHistory.chronicConditions.join(', ')}</Value>
          </ProfileInfo>
          <ProfileInfo>
            <Label>Past Surgeries:</Label>
            <Value>{medicalHistory.pastSurgeries.map(surgery => `${surgery.surgery} (${surgery.year})`).join(', ')}</Value>
          </ProfileInfo>
          <ProfileInfo>
            <Label>Immunizations:</Label>
            <Value>{medicalHistory.immunizations.join(', ')}</Value>
          </ProfileInfo>
        </Section>
      </ProfileContent>
      <br></br>
      <hr style={{ borderColor: '#f2f2f2', borderWidth: '0.5px' }} />
      <br></br>

      <TableContainer>
        <h2>Current Medications</h2>
        <Table>
          <thead>
            <tr>
              <TableHeader>Medication</TableHeader>
              <TableHeader>Dosage</TableHeader>
              <TableHeader>Frequency</TableHeader>
              <TableHeader>Start Date</TableHeader>
            </tr>
          </thead>
          <tbody>
            {currentMedications.map((medication, index) => (
              <TableRow key={index}>
                <TableCell>{medication.medication}</TableCell>
                <TableCell>{medication.dosage}</TableCell>
                <TableCell>{medication.frequency}</TableCell>
                <TableCell>{medication.startDate}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </TableContainer>
      <TableContainer>
        <h2>Past Medications</h2>
        <Table>
          <thead>
            <tr>
              <TableHeader>Medication</TableHeader>
              <TableHeader>Dosage</TableHeader>
              <TableHeader>Frequency</TableHeader>
              <TableHeader>Start Date</TableHeader>
              <TableHeader>End Date</TableHeader>
            </tr>
          </thead>
          <tbody>
            {pastMedications.map((medication, index) => (
              <TableRow key={index}>
                <TableCell>{medication.medication}</TableCell>
                <TableCell>{medication.dosage}</TableCell>
                <TableCell>{medication.frequency}</TableCell>
                <TableCell>{medication.startDate}</TableCell>
                <TableCell>{medication.endDate}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </TableContainer>


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
