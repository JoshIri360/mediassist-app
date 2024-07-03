"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AmbulanceIcon } from "lucide-react";
import {
  collection,
  query,
  getDocs,
  updateDoc,
  doc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuthContext } from "@/context/AuthContext";

interface Hospital {
  id: string;
  name: string;
  placeId: string;
}

export default function EmergencyComponent() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [nearestHospital, setNearestHospital] = useState<Hospital | null>(null);
  const [userLocation, setUserLocation] =
    useState<GeolocationCoordinates | null>(null);
  const [emergencyStatus, setEmergencyStatus] = useState<
    "idle" | "finding" | "notifying" | "confirmed"
  >("idle");
  const { user } = useAuthContext();

  useEffect(() => {
    if (isDialogOpen && emergencyStatus === "finding") {
      getUserLocation();
    }
  }, [isDialogOpen, emergencyStatus]);

  useEffect(() => {
    const findNearestHospital = async () => {
      if (!userLocation) return;

      const hospitalsRef = collection(db, "verifiedHospitals");
      const q = query(hospitalsRef);

      try {
        const querySnapshot = await getDocs(q);
        const hospitals: Hospital[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          placeId: doc.id, // Assuming the document ID is the place ID
        }));

        const nearestHospital = await findNearestHospitalUsingPlacesAPI(
          hospitals
        );

        if (nearestHospital) {
          setNearestHospital(nearestHospital);
          setEmergencyStatus("notifying");
          notifyHospital(nearestHospital);
        } else {
          setEmergencyStatus("idle");
          alert("No nearby hospitals found within 10km.");
        }
      } catch (error) {
        console.error("Error finding nearest hospital:", error);
        setEmergencyStatus("idle");
        alert(
          "An error occurred while finding nearby hospitals. Please try again."
        );
      }
    };

    if (isDialogOpen && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && emergencyStatus === "finding") {
      findNearestHospital();
    }
  }, [isDialogOpen, countdown, emergencyStatus]);

  const getUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => setUserLocation(position.coords),
        (error) => {
          console.error("Error getting location:", error);
          setEmergencyStatus("idle");
          alert(
            "Unable to get your location. Please enable location services and try again."
          );
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setEmergencyStatus("idle");
      alert(
        "Geolocation is not supported by your browser. Please use a different device or browser."
      );
    }
  };

  const findNearestHospitalUsingPlacesAPI = async (
    hospitals: Hospital[]
  ): Promise<Hospital | null> => {
    const placesService = new google.maps.places.PlacesService(
      document.createElement("div")
    );

    const getHospitalDetails = (
      hospital: Hospital
    ): Promise<google.maps.places.PlaceResult> => {
      return new Promise((resolve, reject) => {
        placesService.getDetails(
          { placeId: hospital.placeId },
          (place, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && place) {
              resolve(place);
            } else {
              reject(new Error(`Failed to get details for ${hospital.name}`));
            }
          }
        );
      });
    };

    const hospitalPromises = hospitals.map(async (hospital) => {
      try {
        const details = await getHospitalDetails(hospital);
        if (details.geometry?.location) {
          const distance = calculateDistance(
            userLocation!.latitude,
            userLocation!.longitude,
            details.geometry.location.lat(),
            details.geometry.location.lng()
          );
          return { ...hospital, distance };
        }
      } catch (error) {
        console.error(`Error getting details for ${hospital.name}:`, error);
      }
      return null;
    });

    const hospitalsWithDistances = (await Promise.all(hospitalPromises)).filter(
      (hospital) => hospital !== null
    );
    const sortedHospitals = hospitalsWithDistances.sort(
      (a, b) => a!.distance - b!.distance
    );

    return sortedHospitals.length > 0 && sortedHospitals[0]!.distance <= 10
      ? sortedHospitals[0]!
      : null;
  };

  const notifyHospital = async (hospital: Hospital) => {
    if (!user) return;

    const emergencyInfo = {
      patientId: user.uid,
      patientName: user.displayName || "Unknown",
      patientPhone: user.phoneNumber || "Unknown",
      location: {
        latitude: userLocation!.latitude,
        longitude: userLocation!.longitude,
      },
      timestamp: new Date(),
    };

    try {
      const hospitalRef = doc(db, "verifiedHospitals", hospital.id);
      await updateDoc(hospitalRef, {
        emergencies: arrayUnion(emergencyInfo),
      });
      setEmergencyStatus("confirmed");
    } catch (error) {
      console.error("Error notifying hospital:", error);
      setEmergencyStatus("idle");
      alert(
        "Failed to notify the hospital. Please try again or contact emergency services directly."
      );
    }
  };

  const handleEmergency = () => {
    setIsDialogOpen(true);
    setCountdown(10);
    setEmergencyStatus("finding");
  };

  const cancelEmergency = () => {
    setIsDialogOpen(false);
    setCountdown(10);
    setEmergencyStatus("idle");
    setNearestHospital(null);
  };

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="fixed bottom-20 right-4 z-50 shadow-lg bg-gradient-to-r from-red-600 from-60% to-[#ea7c7c] to-100% border-[#242424] rounded-full py-7"
          onClick={handleEmergency}
        >
          <AmbulanceIcon className="h-6 w-6" color="white" />
          <span className="sr-only">Emergency</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Emergency Assistance</DialogTitle>
        </DialogHeader>
        {emergencyStatus === "finding" && (
          <div>
            <p>Locating nearest hospital... {countdown} seconds to cancel.</p>
            <Button onClick={cancelEmergency}>Cancel</Button>
          </div>
        )}
        {emergencyStatus === "notifying" && (
          <p>Notifying {nearestHospital?.name}. Please stand by...</p>
        )}
        {emergencyStatus === "confirmed" && (
          <div>
            <p>
              Emergency services from {nearestHospital?.name} have been notified
              and are on their way.
            </p>
            <p>Estimated arrival time: [Placeholder for estimated time]</p>
            <p>Hospital contact: [Placeholder for hospital contact]</p>
          </div>
        )}
        <DialogFooter>
          <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
