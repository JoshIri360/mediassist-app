"use client"

import Link from "next/link";
import {
  Tablets,
  Users,
  Calendar,
  Clipboard,
  SettingsIcon,
  Bell,
  Menu,
} from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleUserRound } from "lucide-react";
import ChatComponent from "@/components/ui/chatComponent";
import { usePathname } from "next/navigation";

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const pathname = usePathname();

  function formatDate(date: Date) {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long" as const,
      year: "numeric" as const,
      month: "long" as const,
      day: "numeric" as const,
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  }

  const date = formatDate(new Date());

  const isActiveLink = (path: string) => pathname === path;

  return (
    <div className="flex flex-1 w-full">
      <input type="checkbox" id="sidebar-toggle" className="hidden peer" />
      <nav className="fixed inset-y-0 left-0 z-10 w-60 -translate-x-full peer-checked:translate-x-0 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 shrink-0 flex-col items-start justify-start gap-2 bg-gray-100 p-4">
        <Link href="#" className="flex justify-center w-full" prefetch={false}>
          <span className="text-lg font-bold text-black py-4 text-center">
            MediAssist Doctor
          </span>
        </Link>
        <Link
          href="/protected/doctor"
          className={`flex w-full items-center rounded-lg px-4 py-2 text-sm font-medium ${
            isActiveLink("/protected/doctor")
              ? "bg-primary text-white"
              : "text-gray-600 hover:bg-gray-200 hover:text-gray-800"
          }`}
          prefetch={false}
        >
          <Users className="mr-2 h-4 w-4" />
          Patient List
        </Link>
        <Link
          href="/protected/doctor/medications"
          className={`flex w-full items-center rounded-lg px-4 py-2 text-sm font-medium ${
            isActiveLink("/protected/doctor/medications")
              ? "bg-primary text-white"
              : "text-gray-600 hover:bg-gray-200 hover:text-gray-800"
          }`}
          prefetch={false}
        >
          <Tablets className="mr-2 h-4 w-4" />
          Medication Management
        </Link>
        <Link
          href="/protected/doctor/appointments"
          className={`flex w-full items-center rounded-lg px-4 py-2 text-sm font-medium ${
            isActiveLink("/protected/doctor/appointments")
              ? "bg-primary text-white"
              : "text-gray-600 hover:bg-gray-200 hover:text-gray-800"
          }`}
          prefetch={false}
        >
          <Calendar className="mr-2 h-4 w-4" />
          Appointments
        </Link>
        <Link
          href="/protected/doctor/notes"
          className={`flex w-full items-center rounded-lg px-4 py-2 text-sm font-medium ${
            isActiveLink("/protected/doctor/notes")
              ? "bg-primary text-white"
              : "text-gray-600 hover:bg-gray-200 hover:text-gray-800"
          }`}
          prefetch={false}
        >
          <Clipboard className="mr-2 h-4 w-4" />
          Notes & Observations
        </Link>
        <Link
          href="/protected/doctor/settings"
          className={`flex w-full items-center rounded-lg px-4 py-2 text-sm font-medium ${
            isActiveLink("/protected/doctor/settings")
              ? "bg-primary text-white"
              : "text-gray-600 hover:bg-gray-200 hover:text-gray-800"
          }`}
          prefetch={false}
        >
          <SettingsIcon className="mr-2 h-4 w-4" />
          Settings
        </Link>
      </nav>
      <div className="flex flex-col min-h-screen w-full">
        <header className="sticky top-0 flex h-16 w-full items-center bg-white px-4 md:px-6 border-b border-[#E4E7EC]">
          <Link
            href="#"
            className="flex items-center gap-2 text-[#6C6C6C] text-xl font-semibold"
          >
            {date}
          </Link>
          <nav className="ml-auto flex items-center gap-2">
            <Link
              href="#"
              className="text-sm font-medium text-black rounded-full w-6 h-6 bg-[#D9D9D9] flex items-center justify-center"
              prefetch={false}
            >
              <Bell size={13} />
            </Link>
            <label
              htmlFor="sidebar-toggle"
              className="cursor-pointer md:hidden"
            >
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-400">
                <Menu className="h-5 w-5" />
              </div>
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" className="rounded-full w-8 h-8">
                  <CircleUserRound className="w-full h-full" color="white" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </header>
        <div className="flex flex-1">
          {children}
          <ChatComponent />
        </div>
      </div>
    </div>
  );
}
