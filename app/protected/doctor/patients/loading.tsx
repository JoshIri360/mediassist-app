"use client";

import React, { useEffect, useRef, useState } from "react";
import { quantum } from "ldrs";

quantum.register();

export default function Loading() {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [loaderSpeed, setLoaderSpeed] = useState(1.75);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setLoaderSpeed((prevSpeed) => Math.min(prevSpeed + 0.1, 3));
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      <l-quantum
        size="65"
        speed={loaderSpeed.toString()}
        color="white"
      ></l-quantum>
    </div>
  );
}
