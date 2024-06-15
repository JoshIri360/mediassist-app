"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const libraries: "places"[] = ["places"];

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
            searchNearbyFacilities(pos, map);
          }
        },
        () => {
          console.log("Error: The Geolocation service failed.");
          // Set a default location (e.g., New York City) if geolocation fails
          const defaultPos = { lat: 40.7128, lng: -74.006 };
          setCenter(defaultPos);
          if (map) {
            map.setCenter(defaultPos);
            searchNearbyFacilities(defaultPos, map);
          }
        }
      );
    } else {
      console.log("Error: Your browser doesn't support geolocation.");
      // Set a default location if geolocation is not supported
      const defaultPos = { lat: 40.7128, lng: -74.006 };
      setCenter(defaultPos);
      if (map) {
        map.setCenter(defaultPos);
        searchNearbyFacilities(defaultPos, map);
      }
    }
  }, [map, searchNearbyFacilities]);

  useEffect(() => {
    if (isLoaded && map) {
      getCurrentLocation();
    }
  }, [isLoaded, map, getCurrentLocation]);

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
          <div key={facility.place_id} className="mb-2 p-2 border rounded">
            <h3 className="font-bold">{facility.name}</h3>
            <p>{facility.vicinity}</p>
            {facility.rating && <p>Rating: {facility.rating}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
