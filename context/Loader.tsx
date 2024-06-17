"use client";

import React, { useEffect, useState, useRef } from "react";
import { quantum } from "ldrs";

quantum.register();

const Loader: React.FC = () => {
  const [loaderSpeed, setLoaderSpeed] = useState(1.75);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
};

export default Loader;
