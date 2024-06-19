"use client";

import { Button } from "@/components/ui/button";
import { customAlphabet } from "nanoid";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthContext } from "@/context/AuthContext";
import { db } from "@/firebase/config";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { PlusCircle, X } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Medication = {
  name: string;
  frequency: string;
  dosage: string;
  startDate: string;
  endDate: string;
  times: string[];
};

interface FormData {
  name: string;
  age: string;
  weight: string;
  familyHistory: string;
  allergies: string;
  immunizations: string;
  medications: Medication[];
  gender: string;
  phoneNumber: string;
  address: string;
  bloodType: string;
  pastSurgeries: string;
  hospitalNumber: string;
}

export default function MedicalOnboarding() {
  const { user } = useAuthContext();
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    age: "",
    weight: "",
    familyHistory: "",
    allergies: "",
    immunizations: "",
    medications: [
      {
        name: "",
        frequency: "",
        dosage: "",
        startDate: "",
        endDate: "",
        times: [],
      },
    ],
    gender: "",
    phoneNumber: "",
    address: "",
    bloodType: "",
    pastSurgeries: "",
    hospitalNumber: "",
  });

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (user?.uid) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists() && userDoc.data().onboarded) {
          router.push("/protected/patient");
        }
      }
    };

    checkOnboardingStatus();
  }, [user, router]);

  const handleInputChange = (
    e:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
      | any
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    calculateProgress();
  };

  const addMedication = () => {
    setFormData((prev) => ({
      ...prev,
      medications: [
        ...prev.medications,
        {
          name: "",
          frequency: "",
          dosage: "",
          startDate: "",
          endDate: "",
          times: [],
        },
      ],
    }));
    calculateProgress();
  };

  const removeMedication = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index),
    }));
    calculateProgress();
  };

  const updateMedication = (
    index: number,
    field: keyof Medication,
    value: string | string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      medications: prev.medications.map((med, i) =>
        i === index ? { ...med, [field]: value } : med
      ),
    }));
    calculateProgress();
  };

  const calculateProgress = () => {
    const fields = [
      formData.name,
      formData.age,
      formData.weight,
      formData.familyHistory,
      formData.allergies,
      formData.immunizations,
      ...formData.medications.flatMap((med) => Object.values(med)),
    ];
    const filledFields = fields.filter((field) => {
      if (Array.isArray(field)) {
        return field.length > 0;
      }
      return field.trim() !== "";
    }).length;
    const totalFields = fields.length;
    const newProgress = Math.round((filledFields / totalFields) * 100);
    setProgress(newProgress);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentPage < 2 && user) {
      setCurrentPage(currentPage + 1);
    } else {
      console.log("Form Data:", formData);
      try {
        console.log(user?.uid);
        if (!user?.uid) return;
        const userDocRef = doc(db, "users", user.uid);

        const alphabet =
          "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        const nanoid = customAlphabet(alphabet, 5);

        const hospitalNumber = nanoid();

        const userData = {
          address: formData.address,
          age: formData.age,
          allergies: formData.allergies,
          bloodType: formData.bloodType,
          familyHistory: formData.familyHistory,
          gender: formData.gender,
          immunizations: formData.immunizations,
          name: formData.name,
          pastSurgeries: formData.pastSurgeries,
          phoneNumber: formData.phoneNumber,
          weight: formData.weight,
          medications: [...formData.medications],
          onboarded: true,
          hospitalNumber,
        };

        await updateDoc(userDocRef, userData);

        const medicationsCollectionRef = collection(userDocRef, "medications");

        const existingMeds = await getDocs(medicationsCollectionRef);
        existingMeds.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });

        for (const medication of formData.medications) {
          await addDoc(medicationsCollectionRef, medication);
        }

        router.push("/protected/patient");

        console.log("User data and medications updated successfully");
      } catch (error) {
        console.error("Error updating user data:", error);
      }
    }
  };

  const handleBack = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const updateTimes = (index: number, frequency: string) => {
    const timesCount = parseInt(frequency) || 0;
    const newTimes = Array(timesCount).fill("");
    updateMedication(index, "times", newTimes);
  };

  return (
    <div
      className="flex min-h-screen w-full p-5"
      // style={{ boxSizing: "content-box" }}
    >
      <div className="hidden md:block w-1/2 bg-blue-500 rounded-3xl relative">
        <Image
          src="/downloadbg.jpeg"
          alt="Sign-in image"
          className="h-full w-full object-cover rounded-3xl"
          objectFit="cover"
          layout="fill"
        />
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8"
        >
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
                Medical Onboarding
              </h1>
              <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
                Please fill out the following information to complete your
                medical onboarding.
              </p>
            </div>
            {currentPage === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleInputChange}
                      placeholder="Enter your age"
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      name="weight"
                      type="number"
                      value={formData.weight}
                      onChange={handleInputChange}
                      placeholder="Enter your weight"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) =>
                      handleInputChange({ target: { name: "gender", value } })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="07011111111"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your address"
                  />
                </div>
              </div>
            )}
            {currentPage === 2 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="bloodType">Blood Type</Label>
                  <Input
                    id="bloodType"
                    name="bloodType"
                    value={formData.bloodType}
                    onChange={handleInputChange}
                    placeholder="Enter your blood type"
                  />
                </div>
                <div>
                  <Label htmlFor="familyHistory">
                    Family Medical History (enter &quot;none&quot; or
                    &quot;unknown&quot; if applicable)
                  </Label>
                  <Input
                    id="familyHistory"
                    name="familyHistory"
                    value={formData.familyHistory}
                    onChange={handleInputChange}
                    placeholder="Diabetes"
                  />
                </div>
                <div>
                  <Label htmlFor="allergies">
                    Allergies (enter &quot;none&quot; or &quot;unknown&quot; if
                    applicable)
                  </Label>
                  <Input
                    id="allergies"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleInputChange}
                    placeholder="Peanuts, Shellfish, Pollen"
                  />
                </div>
                <div>
                  <Label htmlFor="immunizations">
                    Immunization Records (enter &quot;none&quot; or
                    &quot;unknown&quot; if applicable)
                  </Label>
                  <Input
                    id="immunizations"
                    name="immunizations"
                    value={formData.immunizations}
                    onChange={handleInputChange}
                    placeholder="Coronavirus, Influenza, Polio"
                  />
                </div>
                <div>
                  <Label htmlFor="pastSurgeries">
                    Past Surgeries (enter &quot;none&quot; or
                    &quot;unknown&quot; if applicable)
                  </Label>
                  <Input
                    id="pastSurgeries"
                    name="pastSurgeries"
                    value={formData.pastSurgeries}
                    onChange={handleInputChange}
                    placeholder="Appendix, Tonsils, Knee Surgery"
                  />
                </div>
                <div>
                  <Label>Current Medications</Label>
                  {formData.medications.map((medication, index) => (
                    <Card key={index} className="mt-2">
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            placeholder="Medication Name"
                            value={medication.name}
                            onChange={(e) =>
                              updateMedication(index, "name", e.target.value)
                            }
                          />
                          <Select
                            value={medication.frequency}
                            onValueChange={(value) => {
                              updateMedication(index, "frequency", value);
                              updateTimes(index, value);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">Once a day</SelectItem>
                              <SelectItem value="2">Twice a day</SelectItem>
                              <SelectItem value="3">Thrice a day</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            placeholder="Dosage"
                            value={medication.dosage}
                            onChange={(e) =>
                              updateMedication(index, "dosage", e.target.value)
                            }
                          />
                        </div>
                        <div className="flex w-full space-x-2 justify-between ">
                          <div className="w-1/2">
                            <Label htmlFor="endDate">Start Date</Label>
                            <Input
                              type="date"
                              placeholder="Start Date"
                              value={medication.startDate}
                              onChange={(e) =>
                                updateMedication(
                                  index,
                                  "startDate",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="w-1/2">
                            <Label htmlFor="endDate">End Date</Label>
                            <Input
                              type="date"
                              placeholder="End Date"
                              value={medication.endDate}
                              onChange={(e) =>
                                updateMedication(
                                  index,
                                  "endDate",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                        {medication.times.map((time, timeIndex) => (
                          <Input
                            key={timeIndex}
                            type="time"
                            placeholder={`Time ${timeIndex + 1}`}
                            value={time}
                            onChange={(e) => {
                              const newTimes = [...medication.times];
                              newTimes[timeIndex] = e.target.value;
                              updateMedication(index, "times", newTimes);
                            }}
                            className="mt-2"
                          />
                        ))}
                        {index > 0 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="mt-2"
                            onClick={() => removeMedication(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-2"
                    onClick={addMedication}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Medication
                  </Button>
                </div>
              </div>
            )}
            <div className="flex items-center justify-between">
              <Progress value={progress} className="w-full" />
              <span className="ml-4 text-sm text-gray-500 dark:text-gray-400">
                {progress}%
              </span>
            </div>
            <div className="flex justify-between">
              {currentPage > 1 && (
                <Button
                  type="button"
                  className="cursor-pointer"
                  onClick={handleBack}
                >
                  Back
                </Button>
              )}
              <Button type="submit" className="cursor-pointer">
                {currentPage === 1 ? "Next" : "Submit"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
