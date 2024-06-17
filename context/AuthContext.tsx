"use client";

import { auth, db } from "@/firebase/config";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { quantum } from "ldrs";

quantum.register();

interface AuthContextType {
  user: User | null;
  role: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      "useAuthContext must be used within an AuthContextProvider"
    );
  }
  return context;
};

interface AuthContextProviderProps {
  children: React.ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [loaderSpeed, setLoaderSpeed] = useState(1.75);
  const router = useRouter();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const allowedRoles = ["patient", "doctor"];
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data();
        if (userData && allowedRoles.includes(userData.role)) {
          setRole(userData.role);
        } else {
          setRole(null);
        }
      }

      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (loading) {
      intervalRef.current = setInterval(() => {
        setLoaderSpeed((prevSpeed) => Math.min(prevSpeed + 0.1, 3));
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [loading]);

  return (
    <AuthContext.Provider value={{ user, role }}>
      {loading ? (
        <div className="flex flex-col items-center justify-center h-screen bg-black">
          <l-quantum
            size="65"
            speed={loaderSpeed.toString()}
            color="white"
          ></l-quantum>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
