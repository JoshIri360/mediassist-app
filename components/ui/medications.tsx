"use client";

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
import { useAuthContext } from "@/context/AuthContext";
import { db } from "@/firebase/config";
import { zodResolver } from "@hookform/resolvers/zod";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  pharmacyContact: string;
  startDate: string;
  endDate: string;
}

interface FormValues {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  pharmacyContact: string;
  startDate: string;
  endDate: string;
}

const medicationSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  dosage: z.string().min(1, { message: "Dosage is required." }),
  frequency: z.string().min(1, { message: "Frequency is required." }),
  duration: z.string().min(1, { message: "Duration is required." }),
  instructions: z.string().min(1, { message: "Instructions are required." }),
  pharmacyContact: z
    .string()
    .min(1, { message: "Pharmacy contact is required." }),
  startDate: z.string().min(1, { message: "Start date is required." }),
  endDate: z.string().min(1, { message: "End date is required." }),
});

export function MedicationsForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(medicationSchema),
    defaultValues: {
      name: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
      pharmacyContact: "",
      startDate: "",
      endDate: "",
    },
  });

  const [medications, setMedications] = useState<Medication[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { user } = useAuthContext();

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  useEffect(() => {
    const fetchMedications = async () => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setMedications(userData.medications || []);
        } else {
          await setDoc(userDocRef, { medications: [] });
          setMedications([]);
        }
      }
    };

    fetchMedications();
  }, [user]);

  const onSubmit = async (values: FormValues) => {
    try {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, {
          medications: [...medications, values],
        });
        setMedications([...medications, values]);
        form.reset();
      }
    } catch (error) {
      console.error("Error adding medication: ", error);
    } finally {
      toggleForm();
    }
  };

  return (
    <div>
      <Button onClick={toggleForm}>
        {isFormOpen ? "Close Form" : "Open Form"}
      </Button>

      {isFormOpen && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
          onClick={() => setIsFormOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2 w-[80vw] sm:w-96"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Medication name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dosage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dosage</FormLabel>
                      <FormControl>
                        <Input placeholder="Dosage" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequency</FormLabel>
                      <FormControl>
                        <Input placeholder="Frequency" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pharmacyContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pharmacy Contact</FormLabel>
                      <FormControl>
                        <Input placeholder="Pharmacy Contact" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
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
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Add Medication</Button>
              </form>
            </Form>
          </div>
        </div>
      )}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {medications.map((med, index) => (
          <div key={index} className="p-4 border rounded-md">
            <h2 className="text-xl font-bold">{med.name}</h2>
            <p>Dosage: {med.dosage}</p>
            <p>Frequency: {med.frequency}</p>
            <p>Duration: {med.duration}</p>
            <p>Instructions: {med.instructions}</p>
            <p>Start Date: {med.startDate}</p>
            <p>End Date: {med.endDate}</p>
            <a
              href={`tel:${med.pharmacyContact}`}
              className="text-blue-500 underline"
            >
              Contact Pharmacy
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
