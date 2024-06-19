//! Add `use client` to prevent this page from being server side rendered
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import signUp from "@/firebase/auth/signup";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { JSX, SVGProps, useState } from "react";
import { toast } from "react-hot-toast";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("patient");

  const router = useRouter();

  const handleForm = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const { result, error } = await signUp(email, password, role);
    if (error) {
      toast.error("Sign up failed, please try again!");
      return console.log(error);
    }

    console.log(result);
    toast.success("Sign up successful!");
    return router.push("/protected/doctor");
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
          <h2 className="text-3xl font-bold mb-4">Hello there!</h2>
          <p className="text-lg">
          Create a new account and take your medication to the next level.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div className="w-full max-w-md space-y-4 px-4 sm:px-6 lg:px-8">
          <div>
            <h2 className="text-3xl font-bold text-center">Sign up</h2>
            <p className="mt-2 text-center text-gray-500 dark:text-gray-400">
              Enter your email and password to create your account.
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
            <div>
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select onValueChange={(value) => setRole(value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="patient">Patient</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">
              Sign up
            </Button>
          </form>
          <div className="text-center">
            <Link className="btn-2 underline" href="/login">
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
