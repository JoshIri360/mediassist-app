"use client";

import { Button } from "@/components/ui/button";
import ChatComponent from "@/components/ui/chatComponent";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthContext } from "@/context/AuthContext";
import {
  Bell,
  CircleUserRound,
  Hospital,
  Menu,
  SettingsIcon,
  Tablets,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, role } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else if (role === "doctor") {
      router.push("/protected/doctor");
    }
  }, [user, role, router]);

  console.log("User", user);

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
    <div className="flex flex-1 w-full h-screen overflow-hidden">
      <input type="checkbox" id="sidebar-toggle" className="hidden peer" />
      <nav className="fixed inset-y-0 left-0 z-20 w-60 -translate-x-full peer-checked:translate-x-0 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 shrink-0 flex flex-col items-start justify-start bg-gray-100 p-4 h-screen overflow-y-auto">
        <Link
          href="#"
          className="flex justify-center w-full mb-4"
          prefetch={false}
        >
          <span className="text-lg font-bold text-black text-center">
            MediAssist
          </span>
        </Link>

        <div className="flex flex-col w-full space-y-2 mb-auto">
          <Link
            href="/protected/patient"
            className={`flex w-full items-center rounded-lg px-4 py-2 text-sm font-medium ${
              isActiveLink("/protected/patient")
                ? "bg-primary text-white"
                : "text-gray-600 hover:bg-gray-200 hover:text-gray-800"
            }`}
            prefetch={false}
          >
            <Tablets className="mr-2 h-4 w-4" />
            Medications
          </Link>
          <Link
            href="/protected/patient/hospitals"
            className={`flex w-full items-center rounded-lg px-4 py-2 text-sm font-medium ${
              isActiveLink("/protected/patient/hospitals")
                ? "bg-primary text-white"
                : "text-gray-600 hover:bg-gray-200 hover:text-gray-800"
            }`}
            prefetch={false}
          >
            <Hospital className="mr-2 h-4 w-4" />
            Locate Hospitals
          </Link>
        </div>

        <div className="w-full space-y-2">
          <Link
            href="/protected/patient/settings"
            className={`flex w-full items-center rounded-lg px-4 py-2 text-sm font-medium mt-auto ${
              isActiveLink("/protected/patient/settings")
                ? "bg-primary text-white"
                : "text-gray-600 hover:bg-gray-200 hover:text-gray-800"
            }`}
            prefetch={false}
          >
            <SettingsIcon className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </div>
      </nav>
      <div className="flex flex-col w-full h-screen overflow-hidden">
        <header className="fixed ml-0 md:ml-60 top-0 left-0 right-0 z-10 flex h-16 items-center bg-white px-4 md:px-6 border-b border-[#E4E7EC]">
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
                  <Link href="/protected/patient/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </header>
        <div className="flex flex-1 pt-16 overflow-hidden">
          <div className="flex-1 overflow-y-auto">{children}</div>
          <ChatComponent />
        </div>
      </div>
    </div>
  );
}
