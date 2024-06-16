"use client";

import ChatComponent from "@/components/ui/chatComponent";
import { useAuthContext } from "@/context/AuthContext";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthContext();

  return (
    <div className="">
      <div className="flex flex-1">
        {children}
        <ChatComponent />
      </div>
    </div>
  );
}
