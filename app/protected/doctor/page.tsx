"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function DoctorPatientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [newPatient, setNewPatient] = useState({
    hospitalNumber: "",
    name: "",
    condition: "",
  });
  const [patientkey, setPatient] = useState<
    { id: number; name: string; condition: string; lastVisit: string }[]
  >([]);

  const handleSearchPatient = async (hospitalNumber: any) => {
    try {
      // Search for the user in the "patients" collection
      const querySnapshot = await getDocs(
        query(
          collection(db, "users"),
          where("hospitalNumber", "==", hospitalNumber)
        )
      );

      if (!querySnapshot.empty) {
        const patientData = querySnapshot.docs[0].data() as {
          id: number;
          name: string;
          condition: string;
          lastVisit: string;
        };
        console.log("Patient found:", patientData);
        // Return the patient data or update the state with the retrieved information
        return patientData;
      } else {
        console.log("No patient found with the given user ID");
      }
    } catch (error) {
      console.error("Error searching for patient:", error);
    }
  };

  const handleSearch = async (hospitalNumber: any) => {
    try {
      const patientData = await handleSearchPatient(hospitalNumber);
      if (patientData) {
        // Add the retrieved patient data to the existing patients list
        setPatient([...patientkey, patientData]);
      }
    } catch (error) {
      console.error("Error searching for patient:", error);
    }
  };

  // Mock patient data
  const patients = [
    {
      id: 1,
      name: "John Doe",
      condition: "Hypertension",
      lastVisit: "2024-06-01",
    },
    {
      id: 2,
      name: "Jane Smith",
      condition: "Diabetes",
      lastVisit: "2024-05-28",
    },
    {
      id: 3,
      name: "Alice Johnson",
      condition: "Asthma",
      lastVisit: "2024-06-05",
    },
  ];

  const filteredPatients = [...patientkey, ...patients].filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Patient List</h1>
      <div className="flex mb-4">
        <Input
          type="text"
          placeholder="Search patients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mr-2"
        />
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Patient</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Patient</DialogTitle>
              <DialogDescription>
                Enter the patient&apos;s hospital number to add them to your
                list.
              </DialogDescription>
            </DialogHeader>
            <Input
              type="text"
              placeholder="Enter user ID"
              value={newPatient.hospitalNumber}
              onChange={(e) =>
                setNewPatient({ ...newPatient, hospitalNumber: e.target.value })
              }
            />
            <Button onClick={() => handleSearch(newPatient.hospitalNumber)}>
              Add Patient
            </Button>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Condition</TableHead>
            <TableHead>Last Visit</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPatients.map((patient) => (
            <TableRow key={patient.id}>
              <TableCell>{patient.name}</TableCell>
              <TableCell>{patient.condition}</TableCell>
              <TableCell>{patient.lastVisit}</TableCell>
              <TableCell>
                <Link href={`/protected/doctor/patients/${patient.id}`}>
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
