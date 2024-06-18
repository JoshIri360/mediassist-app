"use client";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuthContext } from "@/context/AuthContext";
import { SetStateAction, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { db } from "@/firebase/config";

export default function PatientSettingsPage() {
  const { user } = useAuthContext();
  const [settings, setSettings] = useState({
    mobileNotifications: false,
    theme: "light",
    language: "en-GB",
    location: "auto",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setSettings({
            mobileNotifications: userData.mobileNotifications || false,
            theme: userData.theme || "light",
            language: userData.language || "en-GB",
            location: userData.location || "auto",
          });
        } else {
          // User document doesn't exist, create it with default settings
          await setDoc(userRef, settings);
        }
      }
    };

    fetchUserData();
  }, [user, settings]);

  const handleSettingsChange = async (
    updatedSettings: SetStateAction<{
      mobileNotifications: boolean;
      theme: string;
      language: string;
      location: string;
    }>
  ) => {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { ...updatedSettings }, { merge: true });
      setSettings(updatedSettings);
    }
  };

  return (
    <div className="w-full mx-auto py-4 md:py-8 px-5 md:px-8">
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
                <Switch
                  id="mobile-notifications"
                  checked={settings.mobileNotifications}
                  onCheckedChange={(value) =>
                    handleSettingsChange({
                      ...settings,
                      mobileNotifications: value,
                    })
                  }
                />
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
                <Select
                  value={settings.theme}
                  onValueChange={(value) =>
                    handleSettingsChange({ ...settings, theme: value })
                  }
                >
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
                <Select
                  value={settings.language}
                  onValueChange={(value) =>
                    handleSettingsChange({ ...settings, language: value })
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Language" />
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
                <Select
                  value={settings.location}
                  onValueChange={(value) =>
                    handleSettingsChange({ ...settings, location: value })
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Location" />
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
