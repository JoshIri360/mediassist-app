"use client";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function DoctorSettingsPage() {
  const { user, role } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else if (role === "patient") {
      router.push("/protected/patient");
    }
  }, [user, role, router]);

  return (
    <div className="w-full max-w-3xl mx-auto py-12 md:py-16">
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Notifications</h2>
          <div className="grid gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Mobile Notifications
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Receive notifications on your mobile device for important
                updates and activity.
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-gray-900 dark:text-gray-50">
                  Mobile Notifications
                </span>
                <Switch id="mobile-notifications" />
              </div>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Appearance</h2>
          <div className="grid gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Theme</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Choose the theme that best suits your preferences.
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-gray-900 dark:text-gray-50">Theme</span>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Language & Region</h2>
          <div className="grid gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Language</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Select your preferred language.
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-gray-900 dark:text-gray-50">
                  Language
                </span>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue defaultValue="en-GB">English (UK)</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="es-ES">Español (España)</SelectItem>
                    <SelectItem value="fr-FR">Français (France)</SelectItem>
                    <SelectItem value="de-DE">Deutsch (Deutschland)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Location</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Set your location preferences.
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-gray-900 dark:text-gray-50">
                  Location
                </span>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue defaultValue="auto">Automatic</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Automatic</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
