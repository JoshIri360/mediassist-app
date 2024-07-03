"use client"

import React from "react";
import { useAuthContext } from "@/context/AuthContext";
import VideoCall from "@/components/video-call";

const PatientPage: React.FC = () => {
  const { user } = useAuthContext();

  if (!user) {
    return <div>Please log in to access this page.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Patient&rsquo;s Dashboard</h1>
      {/* <VideoCall userId={user.uid} role="patient" /> */}
      <VideoCall />
    </div>
  );
};

export default PatientPage;
