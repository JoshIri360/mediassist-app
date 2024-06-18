"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useAuthContext } from "@/context/AuthContext";
import {
  GoogleMap,
  InfoWindow,
  Libraries,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { LocateIcon, StarIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

const libraries: Libraries = ["places", "geometry"];

interface LatLngLiteral {
  lat: number;
  lng: number;
}

interface PlaceResult {
  place_id: string;
  name: string;
  vicinity: string;
  geometry: {
    location: google.maps.LatLng;
  };
  rating?: number;
}

export default function MedicalFacilitiesMap() {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [center, setCenter] = useState<LatLngLiteral>({ lat: 0, lng: 0 });
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);
  const [facilities, setFacilities] = useState<PlaceResult[]>([]);

  const { user, role } = useAuthContext();
  const router = useRouter();

  const calculateDistance = (
    facility: PlaceResult,
    center: LatLngLiteral
  ): number => {
    const { location } = facility.geometry;
    const facilityCoords = new google.maps.LatLng(
      location.lat(),
      location.lng()
    );
    const centerCoords = new google.maps.LatLng(center.lat, center.lng);
    const distance = google?.maps?.geometry?.spherical?.computeDistanceBetween(
      facilityCoords,
      centerCoords
    );
    return distance;
  };

  const searchNearbyFacilities = useCallback(
    (location: LatLngLiteral, map: google.maps.Map) => {
      const service = new google.maps.places.PlacesService(map);
      const request: google.maps.places.PlaceSearchRequest = {
        location: location,
        radius: 5000,
        type: "hospital",
      };

      service.nearbySearch(
        request,
        (
          results: google.maps.places.PlaceResult[] | null,
          status: google.maps.places.PlacesServiceStatus
        ) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            setFacilities(results as PlaceResult[]);
          }
        }
      );
    },
    []
  );

  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const pos: LatLngLiteral = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          setCenter(pos);
          if (map) {
            map.setCenter(pos);
          }
        },
        () => {
          const defaultPos = { lat: 4.7731, lng: 7.0085 };
          setCenter(defaultPos);
          if (map) {
            map.setCenter(defaultPos);
          }
        }
      );
    } else {
      const defaultPos = { lat: 4.7731, lng: 7.0085 };
      setCenter(defaultPos);
      if (map) {
        map.setCenter(defaultPos);
      }
    }
  }, [map]);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else if (role === "doctor") {
      router.push("/protected/doctor");
    }

    if (isLoaded && map) {
      getCurrentLocation();
    }
  }, [isLoaded, map, getCurrentLocation, user, role, router]);

  useEffect(() => {
    if (map && center.lat !== 0 && center.lng !== 0) {
      searchNearbyFacilities(center, map);
    }
  }, [center, map, searchNearbyFacilities]);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const MapSearchBox: React.FC = () => {
    const {
      ready,
      value,
      suggestions: { status, data },
      setValue,
      clearSuggestions,
    } = usePlacesAutocomplete();

    const handleSelect = async (address: string) => {
      setValue(address, false);
      clearSuggestions();

      try {
        const results = await getGeocode({ address });
        const { lat, lng } = await getLatLng(results[0]);
        const newCenter = { lat, lng };
        setCenter(newCenter);
        map?.panTo(newCenter);
        if (map) searchNearbyFacilities(newCenter, map);
      } catch (error) {}
    };

    return (
      <Command className="rounded-lg border shadow-md">
        <CommandInput
          placeholder="Search for a location"
          value={value}
          onValueChange={(newValue) => {
            setValue(newValue);
            if (newValue === "") {
              clearSuggestions();
            }
          }}
          disabled={!ready}
        />
        {value !== "" && (
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              {status === "OK" &&
                data.map(({ place_id, description }) => (
                  <CommandItem
                    key={place_id}
                    onSelect={() => handleSelect(description)}
                  >
                    {description}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        )}
      </Command>
    );
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps...</div>;

  return (
    <section className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Nearby Medical Facilities</h1>
      <div className="mb-4">
        <MapSearchBox />
      </div>
      <div style={{ height: "400px", width: "100%" }}>
        <GoogleMap
          mapContainerStyle={{ height: "100%", width: "100%" }}
          center={center}
          zoom={14}
          onLoad={onLoad}
        >
          {facilities.map((facility) => (
            <Marker
              key={facility.place_id}
              position={facility.geometry.location}
              onClick={() => setSelectedPlace(facility)}
            />
          ))}

          {selectedPlace && (
            <InfoWindow
              position={selectedPlace.geometry.location}
              onCloseClick={() => setSelectedPlace(null)}
            >
              <div>
                <h2>{selectedPlace.name}</h2>
                <p>{selectedPlace.vicinity}</p>
                {selectedPlace.rating && <p>Rating: {selectedPlace.rating}</p>}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 md:p-6 mt-4 md:px-0">
        {facilities.map((facility) => (
          <Link
            href={`/protected/patient/hospitals/${facility.place_id}`}
            key={facility.place_id}
            className="cursor-pointer"
          >
            <div className="bg-white rounded-lg shadow-lg overflow-hidden dark:bg-gray-950">
              <div className="p-4 md:p-6">
                <h3 className="text-lg font-semibold">{facility.name}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {facility.vicinity}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <LocateIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    {(calculateDistance(facility, center) / 1000).toFixed(2)} km
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  {[...Array(5)].map((_, index) => (
                    <StarIcon
                      key={index}
                      className={`w-4 h-4 ${
                        index < Math.floor(facility.rating || 0)
                          ? "fill-primary"
                          : "fill-muted stroke-muted-foreground"
                      }`}
                    />
                  ))}
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    ({facility.rating})
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </section>
  );
}
