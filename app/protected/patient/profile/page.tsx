"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthContext } from "@/context/AuthContext";
import { db } from "@/firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Copy } from "lucide-react";
import {
  TooltipArrow,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";

interface FormData {
  name: string;
  age: string;
  weight: string;
  familyHistory: string;
  allergies: string;
  immunizations: string;
  gender: string;
  phoneNumber: string;
  address: string;
  bloodType: string;
  pastSurgeries: string;
}

export default function Profile() {
  const { user, role } = useAuthContext();
  const router = useRouter();

  const [hospitalNumber, setHospitalNumber] = useState();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    age: "",
    weight: "",
    familyHistory: "",
    allergies: "",
    immunizations: "",
    gender: "",
    phoneNumber: "",
    address: "",
    bloodType: "",
    pastSurgeries: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid) return;
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const isOnboarded = userData.onboarded || false;
        setHospitalNumber(userData.hospitalNumber);
        setFormData(userData as FormData);
      }
    };

    fetchData();
  }, [user, router]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user?.uid) return;

    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, formData as any);

    console.log("User data updated successfully");
  };

  return (
    <div className="flex min-h-screen w-full p-5">
      <div className="w-full flex items-center justify-center mx-auto">
        <form onSubmit={handleSubmit} className="w-full px-2">
          <div className="space-y-6">
            <div>
              <div className="flex items-center">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
                  Profile
                </h1>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge
                        variant="outline"
                        className="ml-2 cursor-pointer"
                        onClick={() => {
                          if (hospitalNumber) {
                            navigator.clipboard.writeText(hospitalNumber);
                          }
                        }}
                      >
                        {hospitalNumber}
                        <Copy className="ml-1" size={16} />
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <TooltipArrow className="radix-tooltip-arrow" />
                      <div className="rounded bg-black px-2 py-1 text-sm leading-none shadow">
                        <span className="text-white">Hospital Number</span>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>{" "}
              </div>
              <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
                Edit your profile information.
              </p>
            </div>
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
                  Past Surgeries (enter &quot;none&quot; or &quot;unknown&quot;
                  if applicable)
                </Label>
                <Input
                  id="pastSurgeries"
                  name="pastSurgeries"
                  value={formData.pastSurgeries}
                  onChange={handleInputChange}
                  placeholder="Appendix, Tonsils, Knee Surgery"
                />
              </div>
            </div>
            <Button type="submit" className="cursor-pointer">
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
