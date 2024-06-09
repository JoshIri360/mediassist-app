"use client";

import { onMessageListener, requestPermission } from "@/firebase/config";
import React, { createContext, useEffect, useState } from "react";

interface FCMContextType {
  fcmToken: string;
}

export const FCMContext = createContext<FCMContextType | undefined>(undefined);

export const FCMProvider = ({ children }: { children: React.ReactNode }) => {
  const [fcmToken, setFcmToken] = useState("");

  useEffect(() => {
    const getToken = async () => {
      const token = await requestPermission();
      if (token) {
        setFcmToken(token);
      }
    };

    getToken();

    onMessageListener()
      .then((payload) => {
        console.log("Message received. ", payload);
        const notificationTitle = payload.notification.title;
        const notificationOptions = {
          body: payload.notification.body,
          icon: "/firebase-logo.png",
        };

        if (Notification.permission === "granted") {
          new Notification(notificationTitle, notificationOptions);
        }
      })
      .catch((err) => console.log("failed: ", err));
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("fcmToken");
    if (storedToken) {
      setFcmToken(storedToken);
    }
  }, []);

  return (
    <FCMContext.Provider value={{ fcmToken }}>{children}</FCMContext.Provider>
  );
};
