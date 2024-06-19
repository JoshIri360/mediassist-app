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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "./table";
import { useAuthContext } from "@/context/AuthContext";
import { db } from "@/firebase/config";
import { zodResolver } from "@hookform/resolvers/zod";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SparkleIcon } from "lucide-react";

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  pharmacyContact: string;
  startDate: string;
  endDate: string;
  times: string[];
}

interface FormValues {
  name: string;
  dosage: string;
  frequency: string;
  pharmacyContact: string;
  startDate: string;
  endDate: string;
  times: string[];
}

const medicationSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  dosage: z.string().min(1, { message: "Dosage is required." }),
  frequency: z.string().min(1, { message: "Frequency is required." }),
  pharmacyContact: z
    .string()
    .length(11, { message: "Pharmacy contact must be 11 digits." })
    .regex(/^\d+$/, "Pharmacy contact must only contain digits."),
  startDate: z.string().min(1, { message: "Start date is required." }),
  endDate: z.string().min(1, { message: "End date is required." }),
  times: z.array(z.string()).nonempty(),
});

export function MedicationsForm({
  isFormOpen,
  setIsFormOpen,
}: {
  isFormOpen: boolean;
  setIsFormOpen: (isOpen: boolean) => void;
}) {
  const form = useForm<FormValues>({
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

  const [medications, setMedications] = useState<Medication[]>([]);
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchMedications = async () => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        getDoc(userDocRef).then((docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setMedications(userData.medications || []);
            if (userData.medications && userData.medications.length === 1 && userData.medications[0].name === "") {
              setMedications([]);
            }
          } else {
            setDoc(userDocRef, { medications: [] });
            setMedications([]);
          }
        });
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
      setIsFormOpen(false);
    }
  };

  return (
    <div>
      <main className="flex-1 p-4 md:p-6 px-0 md:px-0 w-full">
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
              zIndex: 1000,
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
                  <div className="flex [&>*]:w-full space-x-2">
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
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                // Reset the times field based on the selected frequency
                                form.setValue(
                                  "times",
                                  Array.from({ length: parseInt(value) }).map(
                                    () => ""
                                  )
                                );
                              }}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue
                                  placeholder="Select frequency"
                                  {...field}
                                />
                              </SelectTrigger>
                              <SelectContent
                                style={{
                                  zIndex: 1000,
                                }}
                              >
                                <SelectGroup>
                                  <SelectLabel>Frequency</SelectLabel>
                                  <SelectItem value="1">Once a day</SelectItem>
                                  <SelectItem value="2">Twice a day</SelectItem>
                                  <SelectItem value="3">
                                    Thrice a day
                                  </SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </FormControl>
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
                        <FormLabel>Pharmacy Contact No.</FormLabel>
                        <FormControl>
                          <Input placeholder="08011111111" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex [&>*]:w-full space-x-2">
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
                  </div>

                  {/** Dynamic time inputs based on frequency */}
                  {form.watch("frequency") && (
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
                  <Button type="submit">Add Medication</Button>
                </form>
              </Form>
            </div>
          </div>
        )}
        <div className="border shadow-sm rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Dosage</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Times</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                {/* <TableHead className="w-[80px]">Ask AI</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={7} className="font-bold bg-gray-100">
                  Current Medications
                </TableCell>
              </TableRow>
              {medications
                .filter(
                  (med) => !med.endDate || new Date(med.endDate) >= new Date()
                )
                .map((med, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{med.name}</TableCell>
                    <TableCell>{med.dosage}</TableCell>
                    <TableCell>
                      {med.frequency} {med.frequency === "1" ? "time" : "times"}{" "}
                      per day
                    </TableCell>
                    <TableCell>{med.times && med.times.join(", ")}</TableCell>
                    <TableCell>{med.startDate}</TableCell>
                    <TableCell>{med.endDate}</TableCell>
                    {/* <TableCell>
                      <Button variant="ghost" size="icon" className="w-8 h-8">
                        <SparkleIcon className="h-4 w-4" />
                        <span className="sr-only">Ask AI</span>
                      </Button>
                    </TableCell> */}
                  </TableRow>
                ))}
              <TableRow>
                <TableCell colSpan={7} className="font-bold bg-gray-100">
                  Past Medications
                </TableCell>
              </TableRow>
              {medications
                .filter(
                  (med) => med.endDate && new Date(med.endDate) < new Date()
                )
                .map((med, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{med.name}</TableCell>
                    <TableCell>{med.dosage}</TableCell>
                    <TableCell>
                      {med.frequency} {med.frequency === "1" ? "time" : "times"}{" "}
                      per day
                    </TableCell>
                    <TableCell>{med.times && med.times.join(", ")}</TableCell>
                    <TableCell>{med.startDate}</TableCell>
                    <TableCell>{med.endDate}</TableCell>
                    {/* <TableCell>
                      <Button variant="ghost" size="icon" className="w-8 h-8">
                        <SparkleIcon className="h-4 w-4" />
                        <span className="sr-only">Ask AI</span>
                      </Button>
                    </TableCell> */}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
