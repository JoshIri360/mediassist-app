"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/firebase/config";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { useAuthContext } from "@/context/AuthContext";

interface Emergency {
  id: string;
  patientName: string;
  status: string;
  latitude: number;
  longitude: number;
  timestamp: any;
}

const statusClasses: Record<string, string> = {
  Cleared: "border-green-700 text-green-700",
  Pending: "border-yellow-500 text-yellow-500",
  Active: "border-red-600 text-red-600",
};

const EmergenciesPage: React.FC = () => {
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const { user } = useAuthContext();
  const [hospitalPlaceId, setHospitalPlaceId] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctorHospital = async () => {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", user?.email), where("role", "==", "doctor"));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          setHospitalPlaceId(data.hospitalPlaceId);
        });
      }
    };

    fetchDoctorHospital();
  }, [user]);

  useEffect(() => {
    if (hospitalPlaceId) {
      const fetchEmergencies = async () => {
        const hospitalRef = doc(db, "verifiedHospitals", hospitalPlaceId);
        const hospitalDoc = await getDoc(hospitalRef);
        if (!hospitalDoc.exists()) {
          return;
        }
        const hospitalData = hospitalDoc.data();
        const emergencyData = hospitalData?.emergencies || [];
        setEmergencies(
          emergencyData.map((emergency: any, index: number) => ({
            id: `EMG${index + 1}`,
            patientName: emergency.patientName || "Unknown",
            status: "Cleared",
            latitude: emergency.location.latitude || "N/A",
            longitude: emergency.location.longitude || "N/A",
            timestamp: emergency.timestamp || "N/A",
          }))
        );
      };

      fetchEmergencies();
    }
  }, [hospitalPlaceId]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Emergency List</h1>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Latitude</TableHead>
              <TableHead>Longitude</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {emergencies.map((emergency) => (
              <TableRow key={emergency.id}>
                <TableCell className="font-medium">{emergency.id}</TableCell>
                <TableCell className="font-medium">{emergency.patientName}</TableCell>
                <TableCell>
                  <button
                    className={`px-2 py-0.5 rounded-full border-2 w-20 text-center ${statusClasses[emergency.status]}`}
                  >
                    <span className="">·</span> {emergency.status}
                  </button>
                </TableCell>
                <TableCell>{emergency.latitude}</TableCell>
                <TableCell>{emergency.longitude}</TableCell>
                <TableCell>{new Date(emergency.timestamp.toDate()).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default EmergenciesPage;
