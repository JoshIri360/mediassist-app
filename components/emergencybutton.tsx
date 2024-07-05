import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
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
    <button
      onClick={handleEmergencyClick}
      className={`p-1 rounded-full ${
        isBlinking ? "bg-red-600" : "bg-gray-200"
      } transition-colors duration-300 w-20 h-8 text-xs mt-2`}
    >
      <Bell size={16} color={isBlinking ? "white" : "black"} />
    </button>
  );
};

export default EmergencyButton;