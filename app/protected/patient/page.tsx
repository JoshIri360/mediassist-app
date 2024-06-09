"use client";
import { MedicationsForm } from "@/components/ui/medications";
import useFcmToken from "@/hooks/useFcmToken";
import { useEffect } from "react";

export default function PatientHomePage() {
  const { fcmToken, notificationPermissionStatus } = useFcmToken();

  useEffect(() => {
    if (fcmToken) {
      console.log("FCM token:", fcmToken);
    }
  }, [fcmToken]);

  return (
    <div>
      <h1 className="text-3xl font-bold">Medications</h1>
      <p className="text-gray-600">
        This page will contain all your medications and will remind you when you
        need to take them.
      </p>
      <MedicationsForm />
    </div>
  );
}
