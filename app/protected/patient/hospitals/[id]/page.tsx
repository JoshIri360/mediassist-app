"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthContext } from "@/context/AuthContext";
import { db } from "@/firebase/config";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import {
  CalendarDaysIcon,
  CarIcon,
  GlobeIcon,
  MapPinIcon,
  PhoneIcon,
  StarIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Hospital {
  name: string;
  formatted_phone_number?: string;
  website?: string;
  formatted_address: string;
  rating?: number;
  user_ratings_total?: number;
  opening_hours?: {
    open_now: boolean;
  };
  photos?: {
    photo_reference: string;
  }[];
  editorial_summary?: {
    overview?: string;
  };
}

const fetchHospitalData = async (placeId: string): Promise<Hospital> => {
  const response = await fetch(`/api/place-details?placeId=${placeId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch hospital data");
  }
  return response.json();
};

const checkIfVerified = async (placeId: string) => {
  const collectionRef = collection(db, "verifiedHospitals");
  const docRef = doc(collectionRef, placeId);

  const docSnapshot = await getDoc(docRef);
  if (docSnapshot.exists()) {
    const data = docSnapshot.data();
    return data.doctors || [];
  } else {
    return [];
  }
};

type RouteParams = {
  id: string;
};

export default function HospitalPage() {
  const params = useParams<RouteParams>();
  const { id } = params;
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [appointmentReason, setAppointmentReason] = useState<
    string | undefined
  >("");

  const { user } = useAuthContext();
  const userId = user?.uid;

  const toggleBookingForm = () => setIsBookingFormOpen(!isBookingFormOpen);

  const handleGetDirections = () => {
    if (hospital) {
      const encodedAddress = encodeURIComponent(hospital.formatted_address);
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
      window.open(mapsUrl, "_blank");
    }
  };

  const handleBookAppointment = () => {
    if (!selectedDoctor || !date) {
      alert("Please select a doctor and date.");
      return;
    }

    const appointment = {
      patientId: userId,
      doctorId: selectedDoctor,
      date: date.toISOString(),
      appointmentReason: appointmentReason,
    };

    const docRef = doc(db, "verifiedHospitals", id);

    updateDoc(docRef, {
      appointments: arrayUnion(appointment),
    })
      .then(() => {
        alert("Appointment booked successfully!");
        toggleBookingForm();
      })
      .catch((error) => {
        console.error("Error booking appointment: ", error);
        alert("Failed to book appointment. Please try again.");
      });
  };

  useEffect(() => {
    if (id) {
      Promise.all([
        fetchHospitalData(id as string),
        checkIfVerified(id as string),
      ])
        .then(([hospitalData, doctorsData]) => {
          console.log("Doctor's data", doctorsData);
          setHospital(hospitalData);
          setDoctors(doctorsData);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!hospital) return <div>No hospital data found</div>;

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader className="flex flex-col items-center gap-2 p-6 bg-gray-100 dark:bg-gray-800">
          <CardTitle>{hospital.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex w-full">
            {hospital.photos && hospital.photos.length > 0 ? (
              <Carousel className="w-full max-w-xs py-2 ">
                <CarouselContent>
                  {hospital.photos.map((photo, index) => (
                    <CarouselItem key={index}>
                      <div className="p-1 w-72 h-48 aspect-video rounded-3xl">
                        <Image
                          src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
                          alt={`${hospital.name} image ${index + 1}`}
                          width={300}
                          height={200}
                          objectFit="cover"
                          className="rounded-md"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            ) : (
              <div className="w-full max-w-xs py-2">
                <div className="w-full max-w-xs mx-auto h-[200px] bg-gray-200 flex items-center justify-center rounded-md">
                  <p>No images available</p>
                </div>
              </div>
            )}
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2">
              <PhoneIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <div>{hospital.formatted_phone_number || "Not available"}</div>
            </div>
            <div className="flex items-center gap-2">
              <GlobeIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <Link
                href={hospital.website || "#"}
                className="underline"
                prefetch={false}
              >
                {hospital.website || "Not available"}
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <MapPinIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <div>{hospital.formatted_address}</div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              {Array(Math.floor(hospital.rating || 0))
                .fill(0)
                .map((_, index) => (
                  <StarIcon key={index} className="w-4 h-4 fill-primary" />
                ))}
              {Array(5 - Math.floor(hospital.rating || 0))
                .fill(0)
                .map((_, index) => (
                  <StarIcon
                    key={index + Math.floor(hospital.rating || 0)}
                    className="w-4 h-4 fill-gray-300 dark:fill-gray-600"
                  />
                ))}
              <div>
                {hospital.rating
                  ? `${hospital.rating}/5 (${hospital.user_ratings_total} reviews)`
                  : "Not available"}
              </div>
            </div>
            {hospital.opening_hours && (
              <div className="flex items-center gap-2">
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    hospital.opening_hours.open_now
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }`}
                >
                  {hospital.opening_hours.open_now ? "Open" : "Closed"}
                </div>
              </div>
            )}
            <div className="mt-2">
              <p>
                {hospital.editorial_summary?.overview ||
                  "No description available."}
              </p>
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <Button
              size="lg"
              className="w-full bg-black text-white"
              onClick={handleGetDirections}
            >
              <CarIcon className="w-5 h-5 mr-2" />
              Get directions
            </Button>
            <Button
              size="lg"
              className="w-full ml-4 bg-primary text-white"
              onClick={toggleBookingForm}
            >
              Book Appointment
            </Button>
          </div>
        </CardContent>
      </Card>
      <Dialog open={isBookingFormOpen} onOpenChange={toggleBookingForm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Schedule an Appointment</DialogTitle>
            <DialogDescription>
              Select a doctor and date to book your appointment.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="doctor">Doctor</Label>
              <Select onValueChange={setSelectedDoctor}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors?.length &&
                    doctors.map((doctor, i) => (
                      <SelectItem value={doctor.id} key={doctor.id}>
                        {doctor.name} ({doctor.specialization})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Appointment Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarDaysIcon className="mr-1 h-4 w-4 -translate-x-1" />
                    {date?.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }) || "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border bg-white"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="date">Appointment Reason</Label>
              <Input
                id=""
                type="text"
                required
                value={appointmentReason}
                onChange={(e) => setAppointmentReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="w-full"
              onClick={handleBookAppointment}
            >
              Submit Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
