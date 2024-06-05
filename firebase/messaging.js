import { getMessaging, getToken, onMessage } from "firebase/messaging";

const messaging = getMessaging();

const requestPermission = async () => {
  try {
    await Notification.requestPermission();
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
    });
    console.log("FCM Token:", token);
    return token;
  } catch (error) {
    console.error("Unable to get permission to notify.", error);
  }
};

export { messaging, requestPermission };
