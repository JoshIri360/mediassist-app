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
import { auth, db } from "@/firebase/config";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import {
  Bell,
  CircleUserRound,
  DoorClosed,
  DoorOpen,
  Hospital,
  Menu,
  SettingsIcon,
  Tablets,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface UserData {
  email: string;
}

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [email, setEmail] = useState<string>("");
  const pathname = usePathname();
  const { user, role } = useAuthContext();
  const uid = user?.uid;
  const router = useRouter();

  useEffect(() => {
    const getEmail = async () => {
      const fetchedEmail = await fetchEmail();
      if (fetchedEmail) {
        setEmail(fetchedEmail);
      }
    };

    const fetchEmail = async (): Promise<string | undefined> => {
      if (!uid) return undefined;
      const userRef = doc(db, "users", uid);

      try {
        // Get the current user document
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data() as UserData | undefined;
        return userData?.email;
      } catch (error) {
        console.error("Error fetching email:", error);
        return undefined;
      }
    };

    getEmail();
  }, [uid]);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else if (role === "doctor") {
      router.push("/protected/doctor");
    }

    const fetchData = async () => {
      if (!user?.uid) return;
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const isOnboarded = userData.onboarded || false;

        if (!isOnboarded) {
          router.push("/protected/patient-onboarding");
        }
      }
    };

    fetchData();
  }, [user, router, role]);

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
          <div
            className={`flex w-full items-center justify-between rounded-lg px-4 py-2 text-sm font-medium ${
              isActiveLink("/protected/doctor/profile")
                ? "bg-primary text-white"
                : "text-gray-600 hover:bg-gray-200 hover:text-gray-800"
            }`}
          >
            <div className="flex">
              <div className="self-stretch">
                <CircleUserRound className="mr-2 h-full aspect-square" />
              </div>
              <div>
                <p className="text-[12] leading-[12px]">Profile</p>
                <p
                  className="text-black leading-[14px] overflow-hidden whitespace-nowrap text-overflow-ellipsis"
                  style={{ maxWidth: "130px" }}
                >
                  {email.length > 15 ? `${email.substring(0, 15)}...` : email}
                </p>
              </div>
            </div>
            <div
              className="flex items-center justify-center cursor-pointer"
              onClick={() => {
                signOut(auth);
                router.push("/login");
              }}
            >
              <DoorClosed className="h-6 w-6" />
              <DoorOpen className="h-6 w-6 absolute opacity-0 group-hover:opacity-100" />
            </div>
          </div>
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
                <DropdownMenuItem>
                  <Link href="/protected/patient/settings">Settings</Link>
                </DropdownMenuItem>
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
