"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  GoogleMap,
  InfoWindow,
  Libraries,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import Link from "next/link";
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
            console.log("Facilities found:", results);
          }
        }
      );
    },
    []
  );

  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      console.log("Geolocation is supported!");
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          console.log("Getting current location...");
          const pos: LatLngLiteral = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          console.log("Current location:", pos);
          setCenter(pos);
          if (map) {
            map.setCenter(pos);
          }
        },
        () => {
          console.log("Error: The Geolocation service failed.");
          const defaultPos = { lat: 4.7731, lng: 7.0085 };
          setCenter(defaultPos);
          if (map) {
            map.setCenter(defaultPos);
          }
        }
      );
    } else {
      console.log("Error: Your browser doesn't support geolocation.");
      const defaultPos = { lat: 4.7731, lng: 7.0085 };
      setCenter(defaultPos);
      if (map) {
        map.setCenter(defaultPos);
      }
    }
  }, [map]);

  useEffect(() => {
    if (isLoaded && map) {
      getCurrentLocation();
    }
  }, [isLoaded, map, getCurrentLocation]);

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
      } catch (error) {
        console.log("😱 Error: ", error);
      }
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
    <div className="container mx-auto p-4">
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
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Facility List</h2>
        {facilities.map((facility) => (
          <Link
            href={`/protected/patient/hospitals/${facility.place_id}`}
            key={facility.place_id}
          >
            <Card className="mb-2 hover:shadow-lg transition-shadow duration-300 p-0">
              <CardHeader className="pb-0 p-3">
                <CardTitle >{facility.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <p>{facility.vicinity}</p>
                {facility.rating && <p>Rating: {facility.rating}</p>}
                <p>
                  {(calculateDistance(facility, center) / 1000).toFixed(2)} km
                  away
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
