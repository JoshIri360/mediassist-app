"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Medication {
  name: string;
  frequency: string;
  dosage: string;
  startDate: string;
}

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
}

export default function MedicalOnboarding() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    age: "",
    weight: "",
    familyHistory: "",
    allergies: "",
    immunizations: "",
    medications: [{ name: "", frequency: "", dosage: "", startDate: "" }],
    gender: "",
    phoneNumber: "",
    address: "",
    bloodType: "",
    pastSurgeries: "",
  });

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [progress, setProgress] = useState<number>(0);

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
        { name: "", frequency: "", dosage: "", startDate: "" },
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
    value: string
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
    const filledFields = fields.filter((field) => field.trim() !== "").length;
    const totalFields = fields.length;
    const newProgress = Math.round((filledFields / totalFields) * 100);
    setProgress(newProgress);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentPage < 2) {
      setCurrentPage(currentPage + 1);
    } else {
      console.log("Form Data:", formData);
    }
  };

  const handleBack = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div
      className="flex min-h-screen w-full p-5"
      // style={{ boxSizing: "content-box" }}
    >
      <div className="hidden md:block w-1/2 bg-blue-500 rounded-lg"></div>
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8"
        >
          <div className="space-y-8">
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
              <div className="space-y-6">
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
                  <Textarea
                    id="familyHistory"
                    name="familyHistory"
                    value={formData.familyHistory}
                    onChange={handleInputChange}
                    placeholder="Enter your family medical history"
                    className="min-h-[100px]"
                  />
                </div>
                <div>
                  <Label htmlFor="allergies">
                    Allergies (enter &quot;none&quot; or &quot;unknown&quot; if
                    applicable)
                  </Label>
                  <Textarea
                    id="allergies"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleInputChange}
                    placeholder="Enter your allergies"
                    className="min-h-[100px]"
                  />
                </div>
                <div>
                  <Label htmlFor="immunizations">
                    Immunization Records (enter &quot;none&quot; or
                    &quot;unknown&quot; if applicable)
                  </Label>
                  <Textarea
                    id="immunizations"
                    name="immunizations"
                    value={formData.immunizations}
                    onChange={handleInputChange}
                    placeholder="Enter your immunization records"
                    className="min-h-[100px]"
                  />
                </div>
                <div>
                  <Label htmlFor="pastSurgeries">
                    Past Surgeries (enter &quot;none&quot; or
                    &quot;unknown&quot; if applicable)
                  </Label>
                  <Textarea
                    id="pastSurgeries"
                    name="pastSurgeries"
                    value={formData.pastSurgeries}
                    onChange={handleInputChange}
                    placeholder="Enter your past surgeries"
                    className="min-h-[100px]"
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
                          <Input
                            placeholder="Frequency"
                            value={medication.frequency}
                            onChange={(e) =>
                              updateMedication(
                                index,
                                "frequency",
                                e.target.value
                              )
                            }
                          />
                          <Input
                            placeholder="Dosage"
                            value={medication.dosage}
                            onChange={(e) =>
                              updateMedication(index, "dosage", e.target.value)
                            }
                          />
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
