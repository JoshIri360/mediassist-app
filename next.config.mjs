import scheduleReminders from "./cronJob.js";

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config, { isServer }) {
    if (isServer) {
      console.log("Scheduling reminders...");
      scheduleReminders();
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'aceternity.com',
      },
    ],
  },
};

export default nextConfig;
