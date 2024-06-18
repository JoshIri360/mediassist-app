"use client";
// import { useAuthContext } from "@/context/AuthContext";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";

export default function DoctorSettingsPage() {

  // const { user, role } = useAuthContext();
  //   const router = useRouter();

  //   useEffect(() => {
  //       if (!user) {
  //           router.push("/login");
  //       } else if (role === "patient") {
  //           router.push("/protected/patient");
  //       }
  //   }, [user, role, router]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-bold mb-4">Notifications</h2>
        <div className="mb-4">
          <label
            htmlFor="mobileNotifications"
            className="block text-gray-700 font-bold mb-2"
          >
            Mobile Notifications
          </label>
          <p className="text-gray-500 mb-2">
            It is time description for the notification
          </p>
          <input
            type="checkbox"
            id="mobileNotifications"
            className="form-checkbox h-5 w-5 text-purple-600"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h2 className="text-lg font-bold mb-4">Appearance</h2>
        <div className="mb-4">
          <label
            htmlFor="theme"
            className="block text-gray-700 font-bold mb-2"
          >
            Theme
          </label>
          <p className="text-gray-500 mb-2">
            It is time description for the notification
          </p>
          <select
            id="theme"
            className="form-select block w-full mt-1 rounded-md bg-white py-2 px-3 border border-gray-300 shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          >
            <option>Light</option>
            <option>Dark</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h2 className="text-lg font-bold mb-4">Language and Region</h2>
        <div className="mb-4">
          <label
            htmlFor="language"
            className="block text-gray-700 font-bold mb-2"
          >
            Language
          </label>
          <select
            id="language"
            className="form-select block w-full mt-1 rounded-md bg-white py-2 px-3 border border-gray-300 shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          >
            <option>English (UK)</option>
            <option>English (US)</option>
            <option>French</option>
            <option>Spanish</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="location"
            className="block text-gray-700 font-bold mb-2"
          >
            Location
          </label>
          <select
            id="location"
            className="form-select block w-full mt-1 rounded-md bg-white py-2 px-3 border border-gray-300 shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          >
            <option>Automatic</option>
            <option>Manual</option>
          </select>
        </div>
      </div>
    </div>
  );
}