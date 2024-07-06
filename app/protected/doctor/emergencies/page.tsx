"use client"

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { db } from "@/firebase/config";
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
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
    console.log("Current user:", user);
    const fetchDoctorHospital = async () => {
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", user?.email), where("role", "==", "doctor"));
        const querySnapshot = await getDocs(q);
        console.log("Doctor query snapshot:", querySnapshot);
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            console.log("Doctor data:", data);
            setHospitalPlaceId(data.hospitalPlaceId);
          });
        } else {
          console.log("No matching doctor found");
        }
      } catch (error) {
        console.error("Error fetching doctor hospital:", error);
      }
    };

    fetchDoctorHospital();
  }, [user]);

  useEffect(() => {
    console.log("Hospital Place ID:", hospitalPlaceId);
    if (hospitalPlaceId) {
      const fetchEmergencies = async () => {
        try {
          const hospitalRef = doc(db, "verifiedHospitals", hospitalPlaceId);
          const hospitalDoc = await getDoc(hospitalRef);
          console.log("Hospital document:", hospitalDoc);
          if (!hospitalDoc.exists()) {
            console.log("Hospital document does not exist");
            return;
          }
          const hospitalData = hospitalDoc.data();
          console.log("Hospital data", hospitalData);
          const emergencyData = hospitalData?.emergencies || [];
          console.log("Fetched emergencies:", emergencyData);
          const processedEmergencies = emergencyData.map((emergency: any, index: number) => ({
            id: `EMG${index + 1}`,
            patientName: emergency.patientName || "Unknown",
            status: emergency.status || "Pending",
            latitude: emergency.location?.latitude || "N/A",
            longitude: emergency.location?.longitude || "N/A",
            timestamp: emergency.timestamp ? new Date(emergency.timestamp.seconds * 1000) : new Date(),
          }));
          console.log("Processed emergencies:", processedEmergencies);
          setEmergencies(processedEmergencies);
        } catch (error) {
          console.error("Error fetching emergencies:", error);
        }
      };

      fetchEmergencies();
    }
  }, [hospitalPlaceId]);

  const openGoogleMaps = (latitude: number, longitude: number) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    window.open(url, '_blank');
  };

  const updateEmergencyStatus = async (emergencyId: string, newStatus: string) => {
    try {
      if (!hospitalPlaceId) {
        console.error("Hospital Place ID is not set");
        return;
      }

      const hospitalRef = doc(db, "verifiedHospitals", hospitalPlaceId);
      const hospitalDoc = await getDoc(hospitalRef);

      if (!hospitalDoc.exists()) {
        console.error("Hospital document does not exist");
        return;
      }

      const hospitalData = hospitalDoc.data();
      const emergencies = hospitalData.emergencies || [];
      const updatedEmergencies = emergencies.map((emergency: any) => 
        emergency.id === emergencyId ? { ...emergency, status: newStatus } : emergency
      );

      await updateDoc(hospitalRef, { emergencies: updatedEmergencies });

      setEmergencies(prevEmergencies => 
        prevEmergencies.map(emergency => 
          emergency.id === emergencyId ? { ...emergency, status: newStatus } : emergency
        )
      );

      console.log(`Emergency ${emergencyId} status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating emergency status:", error);
    }
  };

  console.log("Rendering with emergencies:", emergencies);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Emergency List</h1>
      {emergencies.length === 0 ? (
        <p>No emergencies found.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {emergencies.map((emergency) => (
              <TableRow key={emergency.id}>
                <TableCell>{emergency.id}</TableCell>
                <TableCell>{emergency.patientName}</TableCell>
                <TableCell>
                  <Select
                    onValueChange={(value) => updateEmergencyStatus(emergency.id, value)}
                    defaultValue={emergency.status}
                  >
                    <SelectTrigger className={`w-[120px] ${statusClasses[emergency.status]}`}>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Cleared">Cleared</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => openGoogleMaps(emergency.latitude, emergency.longitude)}
                    variant="outline"
                    size="sm"
                  >
                    View on Map
                  </Button>
                </TableCell>
                <TableCell>
                  {emergency.timestamp instanceof Date
                    ? emergency.timestamp.toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'N/A'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default EmergenciesPage;