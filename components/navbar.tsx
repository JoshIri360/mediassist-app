"use client";
import React from "react";
import { FloatingNav } from "./ui/floating-navbar";
import { IconHome } from "@tabler/icons-react";
import { Contact, BookOpenCheck } from "lucide-react";
import { HeroSection } from '@/components/hero';
import { ProblemSolution } from '@/components/problem-solution';
import { GlowingStarsTeam } from '@/components/team';

export function FloatingNavDemo() {
  const navItems = [
    {
      name: "Hero",
      link: "#hero",
      icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Issues",
      link: "#issues",
      icon: <BookOpenCheck className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Team",
      link: "#team",
      icon: <Contact className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
  ];

  return (
    <div className="relative w-full">
      <FloatingNav navItems={navItems} />
      <DummyContent />
    </div>
  );
}

const DummyContent = () => {
  return (
    <div>
      <section id="hero"><HeroSection /></section>
      <section id="issues"><ProblemSolution /></section>
      <section id="team"><GlowingStarsTeam /></section>
    </div>
  );
};
