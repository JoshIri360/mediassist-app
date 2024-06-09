"use client";

import { useAuthContext } from "@/context/AuthContext";
import { FCMContext } from "@/context/FCMContext";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function ProtectedPage() {
  const { user, role } = useAuthContext();
  const fcmContext = useContext(FCMContext);
  const fcmToken = fcmContext ? fcmContext.fcmToken : undefined;
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  console.log("FCM Context: ", fcmContext);

  useEffect(() => {
    if (user === undefined) {
      return;
    }

    if (fcmToken) {
      console.log("FCM Token: ", fcmToken);
      localStorage.setItem("fcmToken", fcmToken);
    }

    setLoading(false);

    if (user == null) {
      router.push("/");
    }

    if (role === "doctor") {
      router.push("/protected/doctor");
    } else if (role === "patient") {
      router.push("/protected/patient");
    }
  }, [router, user, role, fcmToken]);

  if (loading) {
    return <div className="text-5xl font-bold">Loading... {fcmToken}</div>;
  }

  return null;
}
