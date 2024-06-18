"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
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

// Define types for hospital data
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

// Function to fetch hospital data
const fetchHospitalData = async (placeId: string): Promise<Hospital> => {
  const response = await fetch(`/api/place-details?placeId=${placeId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch hospital data");
  }
  return response.json();
};

export default function HospitalPage() {
  const params = useParams();
  const { id } = params;
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleGetDirections = () => {
    if (hospital) {
      const encodedAddress = encodeURIComponent(hospital.formatted_address);
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
      window.open(mapsUrl, "_blank");
    }
  };

  useEffect(() => {
    if (id) {
      fetchHospitalData(id as string)
        .then((data) => {
          setHospital(data);
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

  console.log(hospital);

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
          <div className="flex">
            <Button
              size="lg"
              className="w-full mt-4 bg-black text-white"
              onClick={handleGetDirections}
            >
              <CarIcon className="w-5 h-5 mr-2" />
              Get directions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
