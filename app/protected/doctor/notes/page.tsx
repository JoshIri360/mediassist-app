"use client";
// import { useAuthContext } from "@/context/AuthContext";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";

export default function DoctorNotesPage() {

  // const { user, role } = useAuthContext();
  //   const router = useRouter();

  //   useEffect(() => {
  //       if (!user) {
  //           router.push("/login");
  //       } else if (role === "patient") {
  //           router.push("/protected/patient");
  //       }
  //   }, [user, role, router]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Notes and Obervations List</h1>
    </div>
  );
}
