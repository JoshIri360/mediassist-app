"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useAuthContext } from "@/context/AuthContext";
import { db } from "@/firebase/config";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { usePlacesWidget } from "react-google-autocomplete";

interface FormData {
  name: string;
  specialization: string;
  licenseNumber: string;
  yearsOfExperience: string;
  phoneNumber: string;
  hospitalName: string;
  hospitalAddress: string;
  hospitalPlaceId: string;
}

export default function DoctorOnboarding() {
  const { user } = useAuthContext();
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    specialization: "",
    licenseNumber: "",
    yearsOfExperience: "",
    phoneNumber: "",
    hospitalName: "",
    hospitalAddress: "",
    hospitalPlaceId: "",
  });

  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (user?.uid) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists() && userDoc.data()?.onboarded) {
          router.push("/protected/doctor");
        }
      }
    };

    checkOnboardingStatus();
  }, [user, router]);

  useEffect(() => {
    const calculateProgress = () => {
      const fields = Object.values(formData);
      const filledFields = fields.filter(
        (field) => field && field.trim() !== ""
      ).length;
      const totalFields = fields.length;
      const newProgress = Math.round((filledFields / totalFields) * 100);
      setProgress(newProgress);
    };

    calculateProgress();
  }, [formData]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const { ref: hospitalInputRef } = usePlacesWidget({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    onPlaceSelected: (
      place: google.maps.places.PlaceResult,
      ref,
      autoCompleteRef: any
    ) => {
      setFormData((prev) => ({
        ...prev,
        hospitalName:
          autoCompleteRef?.gm_accessors_?.place?.As?.formattedPrediction || "",
        hospitalAddress: place.formatted_address || "",
        hospitalPlaceId: place.place_id || "",
      }));
    },
    options: {
      types: ["hospital"],
    },
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!user?.uid) return;
      const doctorDocRef = doc(db, "users", user.uid);

      const doctorData = {
        ...formData,
        onboarded: true,
      };

      await setDoc(doctorDocRef, doctorData, { merge: true });

      const verifiedHospitalsRef = collection(db, "verifiedHospitals");
      const hospitalDoc = doc(verifiedHospitalsRef, formData.hospitalPlaceId);
      const hospitalSnapshot = await getDoc(hospitalDoc);

      let hospitalData: {
        name: string;
        address: string;
        doctors?: { name: string; id: string; specialization: string }[];
      } = {
        name: formData.hospitalName,
        address: formData.hospitalAddress,
        doctors: [],
      } as {
        name: string;
        address: string;
        doctors?: { name: string; id: string; specialization: string }[];
      };

      if (hospitalSnapshot.exists()) {
        hospitalData =
          (hospitalSnapshot.data() as {
            name: string;
            address: string;
            doctors?: { name: string; id: string; specialization: string }[];
          }) || hospitalData;
        if (!hospitalData.doctors) {
          hospitalData.doctors = [];
        }
      }

      const doctorInfo = {
        name: formData.name,
        id: user.uid,
        specialization: formData.specialization,
      };

      if (hospitalData?.doctors) {
        hospitalData.doctors.push(doctorInfo);
      }

      await setDoc(hospitalDoc, hospitalData, { merge: true });

      router.push("/protected/doctor");
    } catch (error) {
      console.error("Error updating doctor data:", error);
    }
  };

  return (
    <div className="flex min-h-screen w-full p-5">
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
                Doctor Onboarding
              </h1>
              <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
                Please fill out the following information to complete your
                doctor profile.
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Dr. John Doe"
                />
              </div>
              <div className="flex w-full space-x-2">
                <div className="w-full">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input
                    id="specialization"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    placeholder="e.g. Cardiology, Pediatrics"
                  />
                </div>
                <div className="w-full">
                  <Label htmlFor="licenseNumber">Medical License Number</Label>
                  <Input
                    id="licenseNumber"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    placeholder="Enter your medical license number"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                <Input
                  id="yearsOfExperience"
                  name="yearsOfExperience"
                  type="number"
                  value={formData.yearsOfExperience}
                  onChange={handleInputChange}
                  placeholder="Enter years of experience"
                />
              </div>
              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <Label htmlFor="hospitalSearch">Hospital</Label>
                <Input
                  id="hospitalSearch"
                  ref={hospitalInputRef as any}
                  placeholder="Search for your hospital"
                />
              </div>
              {formData.hospitalName && (
                <div>
                  <p>
                    <strong>Selected Hospital:</strong> {formData.hospitalName}
                  </p>
                  <p>
                    <strong>Address:</strong> {formData.hospitalAddress}
                  </p>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between">
              <Progress value={progress} className="w-full" />
              <span className="ml-4 text-sm text-gray-500 dark:text-gray-400">
                {progress}%
              </span>
            </div>
            <div className="flex justify-end">
              <Button type="submit" className="cursor-pointer">
                Submit
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
