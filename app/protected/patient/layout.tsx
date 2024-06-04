import Link from "next/link";
import { Tablets, Hospital, UsersIcon, SettingsIcon } from "lucide-react";
import React from "react";

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1">
      <nav className="flex w-60 shrink-0 flex-col items-start justify-start gap-2 bg-gray-100 p-4">
        <Link
          href="/protected/patient/medications"
          className="flex w-full items-center rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300"
          prefetch={false}
        >
          <Tablets className="mr-2 h-4 w-4" />
          Medications
        </Link>
        <Link
          href="/protected/patient/hospitals"
          className="flex w-full items-center rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 hover:text-gray-800"
          prefetch={false}
        >
          <Hospital className="mr-2 h-4 w-4" />
          Locate Hospitals
        </Link>
        <Link
          href="/protected/patient/users"
          className="flex w-full items-center rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 hover:text-gray-800"
          prefetch={false}
        >
          <UsersIcon className="mr-2 h-4 w-4" />
          Users
        </Link>
        <Link
          href="/protected/patient/settings"
          className="flex w-full items-center rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 hover:text-gray-800"
          prefetch={false}
        >
          <SettingsIcon className="mr-2 h-4 w-4" />
          Settings
        </Link>
      </nav>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
