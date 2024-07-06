"use client";
import React from "react";
import {
  GlowingStarsBackgroundCard,
  GlowingStarsDescription,
  GlowingStarsTitle,
} from "./ui/glowing-stars";

export function GlowingStarsTeam() {
  return (
    <>
      <div className=" text-6xl pt-20 flex justify-center w-full bg-gray-100 dark:bg-black">
        <h1>Our Team</h1>
      </div>
      <div
        id="team"
        className="flex justify-center items-center min-h-screen w-full mx-auto bg-gray-100 dark:bg-black"
      >
        <div className="grid grid-cols-1 gap-4 md:gap-12 md:grid-cols-2 mx-auto py-20 bg-white dark:bg-black antialiased w-[90%]">
          <a
            href="https://www.linkedin.com/in/jaideloje/"
            target="blank"
            className="col-span-2 md:col-span-1"
          >
            <GlowingStarsBackgroundCard illustrationType={1}>
              <GlowingStarsTitle>Joshua Aideloje</GlowingStarsTitle>
              <div className="flex justify-between items-center">
                <GlowingStarsDescription>
                  Fullstack Developer
                </GlowingStarsDescription>
                <div className="h-8 w-8 rounded-full bg-[hsla(0,0%,100%,.1)] flex items-center justify-center">
                  <Icon />
                </div>
              </div>
            </GlowingStarsBackgroundCard>
          </a>
          <a
            href="https://www.linkedin.com/in/system625/"
            target="blank"
            className="col-span-2 md:col-span-1"
          >
            <GlowingStarsBackgroundCard illustrationType={2}>
              <GlowingStarsTitle>Tunde-Ajayi Olamiposi</GlowingStarsTitle>
              <div className="flex justify-between items-center">
                <GlowingStarsDescription>
                  Frontend Developer
                </GlowingStarsDescription>
                <div className="h-8 w-8 rounded-full bg-[hsla(0,0%,100%,.1)] flex items-center justify-center">
                  <Icon />
                </div>
              </div>
            </GlowingStarsBackgroundCard>
          </a>
          <a
            href="https://www.linkedin.com/in/joseph-shodunke/"
            target="blank"
            className="col-span-2 md:col-span-1"
          >
            <GlowingStarsBackgroundCard illustrationType={3}>
              <GlowingStarsTitle>Shodunke Joseph</GlowingStarsTitle>
              <div className="flex justify-between items-center">
                <GlowingStarsDescription>
                  Backend Developer
                </GlowingStarsDescription>
                <div className="h-8 w-8 rounded-full bg-[hsla(0,0%,100%,.1)] flex items-center justify-center">
                  <Icon />
                </div>
              </div>
            </GlowingStarsBackgroundCard>
          </a>
          <a
            href="https://www.linkedin.com/in/israelademola/"
            target="blank"
            className="col-span-2 md:col-span-1"
          >
            <GlowingStarsBackgroundCard illustrationType={4}>
              <GlowingStarsTitle>Omoniyi Israel</GlowingStarsTitle>
              <div className="flex justify-between items-center">
                <GlowingStarsDescription>
                  Product Designer
                </GlowingStarsDescription>
                <div className="h-8 w-8 rounded-full bg-[hsla(0,0%,100%,.1)] flex items-center justify-center">
                  <Icon />
                </div>
              </div>
            </GlowingStarsBackgroundCard>
          </a>
          <a
            href="https://www.linkedin.com/in/israelademola/"
            target="blank"
            className="col-span-2"
          >
            <GlowingStarsBackgroundCard illustrationType={5}>
              <GlowingStarsTitle>Jeremiah Aideloje</GlowingStarsTitle>
              <div className="flex justify-between items-center">
                <GlowingStarsDescription>
                  Medical Consultant
                </GlowingStarsDescription>
                <div className="h-8 w-8 rounded-full bg-[hsla(0,0%,100%,.1)] flex items-center justify-center">
                  <Icon />
                </div>
              </div>
            </GlowingStarsBackgroundCard>
          </a>
        </div>
      </div>
    </>
  );
}

const Icon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="h-4 w-4 text-white stroke-2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
      />
    </svg>
  );
};
