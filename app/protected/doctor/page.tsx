"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore";
import { db } from "@/firebase/config";
// import { useAuth } from "@/contexts/AuthContext"; // Assuming you have an AuthContext

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface Patient {
  id: string;
  name: string;
  email: string;
  address: string;
  age: number;
  condition: string;
  hospitalNumber: string;
}

interface NewPatient {
  hospitalNumber: string;
  condition: string;
}

export default function DoctorPatientsPage() {
  const { user, role } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else if (role === "patient") {
      router.push("/protected/patient");
    }
  }, [user, role, router]);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [newPatient, setNewPatient] = useState<NewPatient>({
    hospitalNumber: "",
    condition: "",
  });
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    const fetchPatients = async () => {
      if (user) {
        const doctorRef = doc(db, "users", user.uid);
        const doctorSnap = await getDoc(doctorRef);
        if (doctorSnap.exists()) {
          const patientIds = doctorSnap.data().patients || [];
          const patientPromises = patientIds.map((id: string) =>
            getDoc(doc(db, "users", id))
          );
          const patientDocs = await Promise.all(patientPromises);
          const patientData = patientDocs.map(
            (doc) => ({ id: doc.id, ...doc.data() } as Patient)
          );
          setPatients(patientData);
        }
      }
    };
    fetchPatients();
  }, [user]);

  const handleSearchPatient = async (
    hospitalNumber: string
  ): Promise<Patient | undefined> => {
    console.log("Searching for patient with hospital number:", hospitalNumber);
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, "users"),
          where("hospitalNumber", "==", hospitalNumber)
        )
      );

      console.log("Query snapshot empty:", querySnapshot.empty);

      if (!querySnapshot.empty) {
        console.log("Patient found:", querySnapshot.docs[0].data());
        const patientData = querySnapshot.docs[0].data() as Omit<Patient, "id">;
        console.log("Patient found:", patientData);
        return { id: querySnapshot.docs[0].id, ...patientData };
      } else {
        console.log("No patient found with the given hospital number");
        return undefined;
      }
    } catch (error) {
      console.error("Error searching for patient:", error);
      return undefined;
    }
  };

  const handleAddPatient = async () => {
    if (!user) return;
    try {
      const patientData = await handleSearchPatient(newPatient.hospitalNumber);
      if (patientData) {
        const doctorRef = doc(db, "users", user.uid);
        await updateDoc(doctorRef, {
          patients: arrayUnion(patientData.id),
        });

        const updatedPatientData = {
          ...patientData,
          condition: newPatient.condition,
        };
        setPatients([...patients, updatedPatientData]);

        setNewPatient({ hospitalNumber: "", condition: "" });
      }
    } catch (error) {
      console.error("Error adding patient:", error);
    }
  };

  const handleRemovePatient = async (patientId: string) => {
    if (!user) return;
    try {
      const doctorRef = doc(db, "users", user.uid);
      await updateDoc(doctorRef, {
        patients: arrayRemove(patientId),
      });

      setPatients(patients.filter((p) => p.id !== patientId));
    } catch (error) {
      console.error("Error removing patient:", error);
    }
  };

  const handleEditCondition = async (
    patientId: string,
    newCondition: string
  ) => {
    try {
      const patientRef = doc(db, "users", patientId);
      await updateDoc(patientRef, { condition: newCondition });

      setPatients(
        patients.map((p) =>
          p.id === patientId ? { ...p, condition: newCondition } : p
        )
      );
    } catch (error) {
      console.error("Error updating patient condition:", error);
    }
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase())
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
                Enter the patient&apos;s hospital number and condition to add
                them to your list.
              </DialogDescription>
            </DialogHeader>
            <Input
              type="text"
              placeholder="Enter hospital number"
              value={newPatient.hospitalNumber}
              onChange={(e) =>
                setNewPatient({ ...newPatient, hospitalNumber: e.target.value })
              }
            />
            <Input
              type="text"
              placeholder="Enter patient condition"
              value={newPatient.condition}
              onChange={(e) =>
                setNewPatient({ ...newPatient, condition: e.target.value })
              }
            />
            <Button onClick={handleAddPatient}>Add Patient</Button>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>E-mail</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Condition</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPatients.map((patient) => (
            <TableRow key={patient.id}>
              <TableCell>{patient.name}</TableCell>
              <TableCell>{patient.email}</TableCell>
              <TableCell>{patient.address}</TableCell>
              <TableCell>{patient.age}</TableCell>
              <TableCell>{patient.condition}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Link href={`/protected/doctor/patients/${patient.id}`}>
                        View Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => {
                        const newCondition = prompt(
                          "Enter new condition:",
                          patient.condition
                        );
                        if (newCondition)
                          handleEditCondition(patient.id, newCondition);
                      }}
                    >
                      Edit Condition
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => handleRemovePatient(patient.id)}
                    >
                      Remove Patient
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
