"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

  const filteredPatients = patients.filter(
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
                Enter the patient&apos;s hospital number to add them to your list.
              </DialogDescription>
            </DialogHeader>
            <Input type="text" placeholder="Enter hospital number" />
            <Button>Add Patient</Button>
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
