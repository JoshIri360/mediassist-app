import React, { useState, useEffect } from "react";
import { Users } from "lucide-react";
import Link from 'next/link';
import { useRouter } from 'next/router';
import { db } from "@/firebase/config";
import {
  doc,
  onSnapshot,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";

interface EmergencyButtonProps {
  doctorEmail: string;
}

const EmergencyButton: React.FC<EmergencyButtonProps> = ({ doctorEmail }) => {
  const [isBlinking, setIsBlinking] = useState<boolean>(false);
  const [shouldBlink, setShouldBlink] = useState<boolean>(false);
  const [hospitalPlaceId, setHospitalPlaceId] = useState<string | null>(null);
  const [emergencyDocId, setEmergencyDocId] = useState<string | null>(null);


  useEffect(() => {
    const fetchDoctorHospital = async () => {
      try {
        const usersRef = collection(db, "users");
        const q = query(
          usersRef,
          where("email", "==", doctorEmail),
          where("role", "==", "doctor")
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const doctorData = querySnapshot.docs[0].data();
          setHospitalPlaceId(doctorData.hospitalPlaceId);
        }
      } catch (error) {
        console.error("Error fetching doctor's hospital:", error);
      }
    };

    fetchDoctorHospital();
  }, [doctorEmail]);

  useEffect(() => {
    if (hospitalPlaceId) {
      const hospitalRef = doc(db, "verifiedHospitals", hospitalPlaceId);
      
      const unsubscribe = onSnapshot(hospitalRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const hospitalData = docSnapshot.data();
          const emergencies = hospitalData.emergencies || [];
          setShouldBlink(emergencies.length > 0);
          setEmergencyDocId(docSnapshot.id);
        }
      });

      return () => unsubscribe();
    }
  }, [hospitalPlaceId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (shouldBlink) {
      interval = setInterval(() => {
        setIsBlinking((prev) => !prev);
      }, 500);
    } else {
      setIsBlinking(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [shouldBlink]);

  const handleEmergencyClick = async () => {
    if (!hospitalPlaceId || !emergencyDocId) {
      console.error("Hospital ID or Emergency Doc ID is missing");
      return;
    }

    try {
      const hospitalRef = doc(db, "verifiedHospitals", emergencyDocId);
      await updateDoc(hospitalRef, {
        emergencies: [],
      });
      setShouldBlink(false);
    } catch (error) {
      console.error("Error updating emergency status:", error);
    }
  };

  if (!hospitalPlaceId) {
    return null;
  }

  return (
    <Link
  href="/protected/doctor/emergencies"
  className={`flex w-full items-center rounded-lg px-4 py-2 text-sm font-medium ${
    isBlinking ? "bg-red-600 text-white" : "text-gray-600 hover:bg-gray-200 hover:text-gray-800"
  } transition-colors duration-300`}
  prefetch={false}
  onClick={(e) => {
    e.preventDefault();
    handleEmergencyClick();
  }}
>
  <Users className={`mr-2 h-4 w-4 ${isBlinking ? 'animate-pulse' : ''}`} />
  Emergencies
</Link>
  );
};

export default EmergencyButton;