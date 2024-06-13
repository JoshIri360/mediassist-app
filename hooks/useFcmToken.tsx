import { useEffect, useState } from "react";
import { getMessaging, getToken } from "firebase/messaging";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { app } from "@/firebase/config";

type NotificationPermission = "default" | "granted" | "denied";

const useFcmToken = (userId: string | undefined) => {
  const [token, setToken] = useState<string>("");
  const [notificationPermissionStatus, setNotificationPermissionStatus] =
    useState<NotificationPermission>("default");

  useEffect(() => {
    console.log("useFcmToken hook initialized.");
    const retrieveToken = async () => {
      try {
        if (typeof window !== "undefined" && "serviceWorker" in navigator) {
          const messaging = getMessaging(app);

          // Retrieve the notification permission status
          const permission = await Notification.requestPermission();
          setNotificationPermissionStatus(permission);

          console.log("Messaging", messaging);
          console.log("VAPID Key", process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY);

          // Check if permission is granted before retrieving the token
          if (permission === "granted") {
            console.log("Notification permission granted.");
            const currentToken = await getToken(messaging, {
              vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
            });
            if (currentToken) {
              setToken(currentToken);
              await saveFcmTokenToFirestore(userId, currentToken);
            } else {
              console.log(
                "No registration token available. Request permission to generate one."
              );
            }
          }
        }
      } catch (error) {
        console.log("An error occurred while retrieving token:", error);
      }
    };

    retrieveToken();
  }, [userId]);

  const saveFcmTokenToFirestore = async (
    userId: string | undefined,
    fcmToken: string
  ) => {
    if (!userId) {
      console.log("User ID is required to save FCM token");
      return;
    }

    try {
      const db = getFirestore(app);
      const userRef = doc(db, "users", userId);

      // Get the current user document
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();

      // Check if the new token is different from the existing one
      if (userData && userData.fcmToken !== fcmToken) {
        await setDoc(userRef, { fcmToken }, { merge: true });
        console.log("New FCM token saved to Firestore");
      } else if (!userData) {
        // If the user document doesn't exist, create it with the FCM token
        await setDoc(userRef, { fcmToken }, { merge: true });
        console.log("New user document created with FCM token");
      } else {
        console.log("FCM token unchanged, no update needed");
      }
    } catch (error) {
      console.error("Error saving FCM token to Firestore:", error);
    }
  };

  return { fcmToken: token, notificationPermissionStatus };
};

export default useFcmToken;
