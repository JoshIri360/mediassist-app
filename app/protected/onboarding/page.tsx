"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, X } from "lucide-react";

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
}

export default function Component() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    age: "",
    weight: "",
    familyHistory: "",
    allergies: "",
    immunizations: "",
    medications: [{ name: "", frequency: "", dosage: "", startDate: "" }],
  });
  const [progress, setProgress] = useState<number>(0);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
    console.log("Form Data:", formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
            Medical Onboarding
          </h1>
          <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
            Please fill out the following information to complete your medical
            onboarding.
          </p>
        </div>
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
            <Label htmlFor="family-history">
              Family Medical History (enter &quot;none&quot; or
              &quot;unknown&quot; if applicable)
            </Label>
            <Textarea
              id="family-history"
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
                        updateMedication(index, "frequency", e.target.value)
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
                        updateMedication(index, "startDate", e.target.value)
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
        <div className="flex items-center justify-between">
          <Progress value={progress} className="w-full" />
          <span className="ml-4 text-sm text-gray-500 dark:text-gray-400">
            {progress}%
          </span>
        </div>
        <div className="flex justify-end">
          <Button type="submit" className="w-full sm:w-auto cursor-pointer">
            Submit
          </Button>
        </div>
      </div>
    </form>
  );
}
