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
    <div className="flex flex-col min-h-screen w-screen">
      <div className="flex flex-1">
        {children}
        <ChatComponent />
      </div>
    </div>
  );
}
