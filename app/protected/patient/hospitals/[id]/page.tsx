"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
  console.log("Id");
  const params = useParams();
  const { id } = params;
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
        <CardHeader>
          <CardTitle>{hospital.name}</CardTitle>
        </CardHeader>
        <CardContent>
          {hospital.photos && hospital.photos.length > 0 ? (
            <Carousel className="w-full max-w-xs mx-auto">
              <CarouselContent>
                {hospital.photos.map((photo, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Image
                        src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
                        alt={`${hospital.name} image ${index + 1}`}
                        width={300}
                        height={200}
                        className="rounded-md"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          ) : (
            <div className="w-full max-w-xs mx-auto h-[200px] bg-gray-200 flex items-center justify-center rounded-md">
              <p>No images available</p>
            </div>
          )}

          <div className="mt-4">
            <p>
              <strong>Phone:</strong>{" "}
              {hospital.formatted_phone_number || "Not available"}
            </p>
            <p>
              <strong>Website:</strong>{" "}
              {hospital.website ? (
                <a
                  href={hospital.website}
                  className="text-blue-500 hover:underline"
                >
                  {hospital.website}
                </a>
              ) : (
                "Not available"
              )}
            </p>
            <p>
              <strong>Address:</strong> {hospital.formatted_address}
            </p>
            <p>
              <strong>Rating:</strong>{" "}
              {hospital.rating
                ? `${hospital.rating}/5 (${hospital.user_ratings_total} reviews)`
                : "Not available"}
            </p>
            {hospital.opening_hours && (
              <p>
                <strong>Open now:</strong>{" "}
                {hospital.opening_hours.open_now ? "Yes" : "No"}
              </p>
            )}
            <p className="mt-2">
              {hospital.editorial_summary?.overview ||
                "No description available."}
            </p>
          </div>

          <Button className="mt-4 bg-black text-white">Call an Uber</Button>
        </CardContent>
      </Card>
    </div>
  );
}
