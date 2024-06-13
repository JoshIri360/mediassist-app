"use client"

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthContext } from "@/context/AuthContext";
import { CircleUserRound, MountainIcon } from "lucide-react";
import Link from "next/link";
import ChatComponent from "@/components/ui/chatComponent";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthContext();
  console.log(user);

  return (
    <div className="flex flex-col min-h-screen w-full">
      <header className="sticky top-0 z-50 flex h-12 w-full items-center bg-gray-900 px-4 md:px-6">
        <Link href="#" className="flex items-center gap-2" prefetch={false}>
          <MountainIcon className="h-6 w-6 text-white" />
          <span className="text-lg font-semibold text-white">MediAssist</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4">
          <Link
            href="#"
            className="text-sm font-medium text-gray-300 hover:text-white"
            prefetch={false}
          >
            Features
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-gray-300 hover:text-white"
            prefetch={false}
          >
            Pricing
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-gray-300 hover:text-white"
            prefetch={false}
          >
            About
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-gray-300 hover:text-white"
            prefetch={false}
          >
            Contact
          </Link>
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
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </header>
      <div className="flex flex-1">
        {children}
        <ChatComponent/>
      </div>
    </div>
  );
}
