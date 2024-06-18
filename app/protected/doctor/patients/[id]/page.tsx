"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
// import { useRouter } from "next/navigation";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PrinterIcon } from "lucide-react";

interface Patient {
  id: string;
  name: string;
  email: string;
  address: string;
  age: string;
  allergies: string;
  bloodType: string;
  familyHistory: string;
  gender: string;
  immunizations: string;
  medications: Medication[];
  pastSurgeries: string;
  phoneNumber: string;
  weight: string;
}

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  pharmacyContact: string;
  startDate: string;
  endDate: string;
  times: string[];
}

const medicationSchema = z.object({
  name: z.string().min(1, "Medication name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  frequency: z.string().min(1, "Frequency is required"),
  pharmacyContact: z.string().min(1, "Pharmacy contact is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  times: z.array(z.string()).min(1, "At least one time is required"),
});

export default function PatientPage() {
  const { id } = useParams();
  const { user, role } = useAuthContext();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddMedicationForm, setShowAddMedicationForm] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else if (role === "patient") {
      router.push("/protected/patient");
    }
  }, [user, role, router]);

  const form = useForm<Medication>({
    resolver: zodResolver(medicationSchema),
    defaultValues: {
      name: "",
      dosage: "",
      frequency: "",
      pharmacyContact: "",
      startDate: "",
      endDate: "",
      times: [],
    },
  });

  useEffect(() => {
    const fetchPatient = async () => {
      if (user && id) {
        try {
          const patientDoc = await getDoc(doc(db, "users", id as string));
          if (patientDoc.exists()) {
            setPatient({ id: patientDoc.id, ...patientDoc.data() } as Patient);
          }
        } catch (error) {
          console.error("Error fetching patient:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchPatient();
  }, [user, id]);

  const onSubmit = async (data: Medication) => {
    if (patient) {
      try {
        await updateDoc(doc(db, "users", patient.id), {
          medications: arrayUnion(data),
        });
        setPatient({ ...patient, medications: [...patient.medications, data] });
        form.reset();
      } catch (error) {
        console.error("Error adding medication:", error);
      }
    }
  };

  const handleRemoveMedication = async (medicationToRemove: Medication) => {
    if (patient) {
      try {
        await updateDoc(doc(db, "users", patient.id), {
          medications: arrayRemove(medicationToRemove),
        });
        setPatient({
          ...patient,
          medications: patient.medications.filter(
            (med) => med.name !== medicationToRemove.name
          ),
        });
      } catch (error) {
        console.error("Error removing medication:", error);
      }
    }
  };

  const handlePrint = () => {
    const printContent = printRef.current;
    if (printContent) {
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContents;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!patient) {
    return <div>Patient not found</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Patient Medical File</h1>
        <Button onClick={handlePrint} variant="outline">
          <PrinterIcon className="mr-2 h-4 w-4" /> Print
        </Button>
      </div>
      <div ref={printRef}>
        <Separator className="my-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Personal Information</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Name:</span>
                <span>{patient.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Age:</span>
                <span>{patient.age}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Gender:</span>
                <span>{patient.gender}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Phone:</span>
                <span>{patient.phoneNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Email:</span>
                <span>{patient.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Address:</span>
                <span>{patient.address}</span>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Medical History</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Blood Type:</span>
                <span>{patient.bloodType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Allergies:</span>
                <span>{patient.allergies}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Family History:</span>
                <span>{patient.familyHistory}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Past Surgeries:</span>
                <span>{patient.pastSurgeries}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Immunizations:</span>
                <span>{patient.immunizations}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Weight:</span>
                <span>{patient.weight} kg</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <div>
          <h2 className="text-lg font-semibold mb-2">Current Medications</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medication</TableHead>
                <TableHead>Dosage</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patient.medications.map((medication, index) => (
                <TableRow key={index}>
                  <TableCell>{medication.name}</TableCell>
                  <TableCell>{medication.dosage}</TableCell>
                  <TableCell>{medication.frequency}</TableCell>
                  <TableCell>{medication.startDate}</TableCell>
                  <TableCell>{medication.endDate}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveMedication(medication)}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Separator className="my-4" />

      <Button
        onClick={() => setShowAddMedicationForm(!showAddMedicationForm)}
        className="mb-4"
      >
        {showAddMedicationForm
          ? "Hide Add Medication Form"
          : "Add New Medication"}
      </Button>

      {showAddMedicationForm && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Add New Medication</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medication Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex space-x-4">
                <FormField
                  control={form.control}
                  name="dosage"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Dosage</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="frequency"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Frequency</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.setValue(
                            "times",
                            Array.from({ length: parseInt(value) }).map(
                              () => ""
                            )
                          );
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">Once a day</SelectItem>
                          <SelectItem value="2">Twice a day</SelectItem>
                          <SelectItem value="3">Thrice a day</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="pharmacyContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pharmacy Contact</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex space-x-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {form.watch("frequency") && (
                <FormField
                  control={form.control}
                  name="times"
                  render={() => (
                    <FormItem>
                      <FormLabel>Times</FormLabel>
                      <div className="flex space-x-2">
                        {[
                          ...Array(parseInt(form.watch("frequency") || "0")),
                        ].map((_, index) => (
                          <FormField
                            key={index}
                            control={form.control}
                            name={`times.${index}`}
                            render={({ field }) => (
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <Button type="submit">Add Medication</Button>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
}
