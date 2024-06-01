//! Add `use client` to prevent this page from being server side rendered
"use client";

import { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/config";
import { Button } from "@/components/ui/button";

export default function Page() {
  const { user, role } = useAuthContext();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user === undefined) {
      return;
    }

    setLoading(false);

    if (user == null) {
      router.push("/");
    }
  }, [router, user]);

  if (loading) {
    return <div className="text-5xl font-bold">Loading...</div>;
  }

  return (
    <>
      <div className="flex flex-col items-center py-10 px-10 ">
        {user && (
          <p className="text-4xl lg:text-5xl py-5 text-center ">
            Welcome, <span className="font-bold">{user.email}</span> of role{" "}
            <span className="font-bold">{role}</span>
          </p>
        )}
        <h1 className="text-3xl lg:text-4xl px-8 py-7 text-center">
          Only logged in users can view this page!
        </h1>
        <h2 className="text-2xl lg:text-3xl px-8 pb-7 text-center">
          Check Authentication in the Firebase console to see new user
        </h2>
        <Button
          className="btn-4"
          onClick={() =>
            signOut(auth).then(() => {
              router.push("/login");
            })
          }
        >
          Sign out
        </Button>
      </div>
    </>
  );
}
