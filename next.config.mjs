import scheduleReminders from './cronJob.js';

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config, { isServer }) {
    if (isServer) {
      scheduleReminders();
    }
    return config;
  },
};

export default nextConfig;
