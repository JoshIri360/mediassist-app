"use client";

import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedPage() {
  const { user, role } = useAuthContext();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user === undefined) {
      return;
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
  }, [router, user, role]);

  if (loading) {
    return <div className="text-5xl font-bold">Loading...</div>;
  }

  return null;
}
