"use client";
import React from "react";
import { HeroParallax } from "./ui/hero-parallax";

export function HomePreview() {
  return (
    <div id="preview" className='w-full overflow-hidden'>
      <HeroParallax products={products} />
    </div>
  );
}
export const products = [
  {
    title: "Create Account",
    link: "/login",
    thumbnail: "/images/createaccount.png",
  },
  {
    title: "Locate Hospitals",
    link: "/login",
    thumbnail: "/images/locatehospital.png",
  },
  {
    title: "Medications",
    link: "/login",
    thumbnail: "/images/medicationsemptystate.png",
  },
  {
    title: "Patient",
    link: "/login",
    thumbnail: "/images/patientcenter.png",
  },
  {
    title: "Create Account",
    link: "/login",
    thumbnail: "/images/createaccount.png",
  },
  {
    title: "Locate Hospitals",
    link: "/login",
    thumbnail: "/images/locatehospital.png",
  },
  {
    title: "Medications",
    link: "/login",
    thumbnail: "/images/medicationsemptystate.png",
  },
  {
    title: "Patient",
    link: "/login",
    thumbnail: "/images/patientcenter.png",
  },
  {
    title: "Create Account",
    link: "/login",
    thumbnail: "/images/createaccount.png",
  },
  {
    title: "Locate Hospitals",
    link: "/login",
    thumbnail: "/images/locatehospital.png",
  },
  {
    title: "Medications",
    link: "/login",
    thumbnail: "/images/medicationsemptystate.png",
  },
  {
    title: "Patient",
    link: "/login",
    thumbnail: "/images/patientcenter.png",
  },
  {
    title: "Create Account",
    link: "/login",
    thumbnail: "/images/createaccount.png",
  },
  {
    title: "Locate Hospitals",
    link: "/login",
    thumbnail: "/images/locatehospital.png",
  },
  {
    title: "Medications",
    link: "/login",
    thumbnail: "/images/medicationsemptystate.png",
  },
  {
    title: "Patient",
    link: "/login",
    thumbnail: "/images/patientcenter.png",
  },
];
