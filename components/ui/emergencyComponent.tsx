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
  getDoc,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuthContext } from "@/context/AuthContext";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { Progress } from "@/components/ui/progress";

interface Hospital {
  id: string;
  name: string;
  placeId: string;
  latitude?: number;
  longitude?: number;
}

const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

export default function EmergencyComponent() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [nearestHospital, setNearestHospital] = useState<Hospital | null>(null);
  const [userLocation, setUserLocation] =
    useState<GeolocationCoordinates | null>(null);
  const [emergencyStatus, setEmergencyStatus] = useState<
    "idle" | "finding" | "notifying" | "confirmed"
  >("idle");
  const [progress, setProgress] = useState(0);
  const [userInfo, setUserInfo] = useState({ name: "", phoneNumber: "" });
  const { user } = useAuthContext();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey,
    libraries: ["places", "geometry"],
  });

  useEffect(() => {
    if (isDialogOpen && emergencyStatus === "finding") {
      getUserLocation();
    }
  }, [isDialogOpen, emergencyStatus]);

  useEffect(() => {
    const findNearestHospital = async () => {
      if (!userLocation || !isLoaded) return;

      const hospitalsRef = collection(db, "verifiedHospitals");
      const q = query(hospitalsRef);

      try {
        const querySnapshot = await getDocs(q);
        const hospitals: Hospital[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          placeId: doc.id,
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
  }, [isDialogOpen, countdown, emergencyStatus, isLoaded, userLocation]);

  useEffect(() => {
    if (emergencyStatus === "finding" || emergencyStatus === "notifying") {
      const interval = setInterval(() => {
        setProgress((prevProgress) =>
          prevProgress >= 1000 ? 0 : prevProgress + 10
        );
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [emergencyStatus]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (user?.uid) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserInfo({
            name: data.name || "Unknown",
            phoneNumber: data.phoneNumber || "Unknown",
          });
        }
      }
    };
    fetchUserInfo();
  }, [user]);

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
    if (!isLoaded || !google.maps.places) {
      console.error("Google Maps Places API not loaded");
      return null;
    }

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
          return {
            ...hospital,
            distance,
            latitude: details.geometry.location.lat(),
            longitude: details.geometry.location.lng(),
          };
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
    if (!user?.uid) return;

    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      console.error("User document does not exist.");
      setEmergencyStatus("idle");
      alert("User information not found. Please try again.");
      return;
    }

    const userData = userDoc.data();

    const emergencyInfo = {
      patientId: user.uid,
      patientName: userData.name || "Unknown",
      patientPhone: userData.phoneNumber || "Unknown",
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
    setShowConfirmation(true);
  };

  const confirmEmergency = () => {
    setShowConfirmation(false);
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
    const R = 6371;
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

  const getStatusMessage = () => {
    switch (emergencyStatus) {
      case "finding":
        return "Hang tight! We're locating the nearest hospital...";
      case "notifying":
        return `We're notifying ${nearestHospital?.name}. Help is on the way!`;
      case "confirmed":
        return `Emergency confirmed. ${nearestHospital?.name} has been notified and help is coming.`;
      default:
        return "Press the button to request emergency assistance.";
    }
  };

  return (
    <>
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
          <p className="text-lg font-semibold">{getStatusMessage()}</p>
          {(emergencyStatus === "finding" ||
            emergencyStatus === "notifying") && (
            <Progress value={progress} className="w-full" />
          )}
          {emergencyStatus === "finding" && (
            <div>
              <p>Locating nearest hospital... {countdown} seconds to cancel.</p>
              <Button onClick={cancelEmergency}>Cancel</Button>
            </div>
          )}
          {nearestHospital && userLocation && (
            <div style={{ height: "200px", width: "100%" }}>
              <GoogleMap
                center={{
                  lat: userLocation.latitude,
                  lng: userLocation.longitude,
                }}
                zoom={12}
                mapContainerStyle={{ height: "100%", width: "100%" }}
              >
                <Marker
                  position={{
                    lat: userLocation.latitude,
                    lng: userLocation.longitude,
                  }}
                />
                {nearestHospital.latitude && nearestHospital.longitude && (
                  <Marker
                    position={{
                      lat: nearestHospital.latitude,
                      lng: nearestHospital.longitude,
                    }}
                  />
                )}
              </GoogleMap>
            </div>
          )}
          <div className="mt-4">
            <h3 className="font-semibold">Your contact information:</h3>
            <p>Name: {userInfo.name}</p>
            <p>Phone: {userInfo.phoneNumber}</p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Emergency</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to request emergency assistance?</p>
          <DialogFooter>
            <Button onClick={() => setShowConfirmation(false)}>Cancel</Button>
            <Button
              onClick={confirmEmergency}
              className="bg-red-600 text-white"
            >
              Confirm Emergency
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
