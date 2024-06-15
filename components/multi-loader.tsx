"use client";

import React, { useState, useEffect } from "react";
import { MultiStepLoader as Loader } from "./ui/multi-step-loader";

const loadingStates = [
  { text: "Ugh, food poisoning again..." },
  { text: "Launch MediAssist symptom checker." },
  { text: '"I regret that expired gala."' },
  { text: "Finding nearest emergency room." },
  { text: "Navigating to hospital now." },
  { text: 'Doctor: "No more sketchy food!"' },
  { text: '"But it was free..."' },
  { text: "Prescribed medication added to app." },
  { text: "Set dosage reminders." },
  { text: "Recovery mode." },
];

export function MultiStepLoaderDemo() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Calculate the total duration of the loading sequence
    const totalDuration = loadingStates.length * 1000;

    // Set a timeout to change the loading state to false after the sequence completes
    const timer = setTimeout(() => {
      setLoading(false);
    }, totalDuration);

    // Clean up the timer on component unmount
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full flex items-center justify-center bg-black">
      <Loader loadingStates={loadingStates} loading={loading} duration={1000} />
    </div>
  );
}
