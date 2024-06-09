"use client";

import { useAuthContext } from "@/context/AuthContext";
import { app } from "@/firebase/config";
import useFcmToken from "@/hooks/useFcmToken";
import { getMessaging, onMessage } from "firebase/messaging";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedPage() {
  const { user, role } = useAuthContext();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { fcmToken, notificationPermissionStatus } = useFcmToken();

  useEffect(() => {
    if (fcmToken) {
      console.log("FCM token:", fcmToken);
    }
  }, [fcmToken]);

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      const messaging = getMessaging(app);
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log("Foreground push notification received:", payload);
      });

      return () => {
        unsubscribe();
      };
    }
  }, []);

  useEffect(() => {
    if (user !== undefined) {
      setLoading(false);

      if (user === null) {
        router.push("/");
      } else if (role === "doctor") {
        router.push("/protected/doctor");
      } else if (role === "patient") {
        router.push("/protected/patient");
      }
    }
  }, [router, user, role]);

  if (loading) {
    return <div className="text-5xl font-bold">Loading...</div>;
  }

  return null;
}
