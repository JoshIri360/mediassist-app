"use client";
import React from "react";
import { FloatingNav } from "./ui/floating-navbar";
import { IconHome } from "@tabler/icons-react";
import { Contact, Fullscreen, BookOpenCheck } from "lucide-react";

export function FloatingNavDemo() {
  const navItems = [
    {
      name: "Home",
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
    {
      name: "Preview",
      link: "#preview",
      icon: <Fullscreen className="h-4 w-4 text-neutral-500 dark:text-white" />,
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
    </div>
  );
};
