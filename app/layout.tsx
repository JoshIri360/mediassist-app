import "./globals.css";

import { AuthContextProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";
import { Libre_Franklin, Rubik } from "next/font/google";

const libre_franklin = Libre_Franklin({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-libre_franklin",
});

const rubik = Rubik({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-rubik",
});

export const metadata = {
  title: "Next.js & Firebase Auth",
  description: " Next.js & Firebase Authentication Tutorial",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={libre_franklin.variable + " " + rubik.variable}>
        <AuthContextProvider>{children}</AuthContextProvider>
        <Toaster />
      </body>
    </html>
  );
}
