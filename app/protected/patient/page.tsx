"use client";
import { Button } from "@/components/ui/button";
import { MedicationsForm } from "@/components/ui/medications";
import { useAuthContext } from "@/context/AuthContext";
import useFcmToken from "@/hooks/useFcmToken";
import { useEffect, useState } from "react";

export default function PatientHomePage() {
  const { user, role } = useAuthContext();
  const { fcmToken, notificationPermissionStatus } = useFcmToken(user?.uid);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    if (fcmToken) {
      console.log("FCM token:", fcmToken);
    }
  }, [fcmToken]);

  return (
    <div className="px-4 md:px-6 w-full">
      <div className="flex justify-between w-full items-center">
        <div>
          <h1 className="text-3xl font-bold">Medications</h1>
          <p className="text-[#ACACAC]">
            Add and schedule reminders for your medications
          </p>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          className="bg-primary text-white"
        >
          Add Medications
        </Button>
      </div>
      <MedicationsForm isFormOpen={isFormOpen} setIsFormOpen={setIsFormOpen} />
    </div>
  );
}
