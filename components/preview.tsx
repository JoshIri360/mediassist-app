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
    title: "Moonbeam",
    link: "/images/createaccount.png",
    thumbnail: "/images/createaccount.png",
  },
  {
    title: "Cursor",
    link: "/images/locatehospital.png",
    thumbnail: "/images/locatehospital.png",
  },
  {
    title: "Rogue",
    link: "/images/medicationsemptystate.png",
    thumbnail: "/images/medicationsemptystate.png",
  },
  {
    title: "Editorially",
    link: "/images/patientcenter.png",
    thumbnail: "/images/patientcenter.png",
  },
];
