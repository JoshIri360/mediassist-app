"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import signIn from "@/firebase/auth/signin";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleForm = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const { result, error } = await signIn(email, password);
    if (error) {
      toast.error("Sign in failed, please try again!");
      return console.log(error);
    }

    console.log(result);
    toast.success("Sign in successful!");
    return router.push("/protected");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 h-screen w-full p-4">
      <div className="relative hidden lg:block">
        <div>
          <Image
            src="/downloadbg.jpeg"
            alt="Sign-in image"
            className="h-full w-full object-cover rounded-3xl"
            objectFit="cover"
            layout="fill"
          />
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center max-w-md px-6">
          <h2 className="text-3xl font-bold mb-4">Welcome back!</h2>
          <p className="text-lg">
            Sign in to your account and start exploring our amazing features.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div className="w-full max-w-md space-y-4 px-4 sm:px-6 lg:px-8">
          <div>
            <h2 className="text-3xl font-bold text-center">Sign in</h2>
            <p className="mt-2 text-center text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in to your account.
            </p>
          </div>
          <form className="space-y-3" onSubmit={handleForm}>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>
          <div className="text-center">
            <Link className="btn-2 underline" href="/signup">
              Don&apos;t have an account? Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
