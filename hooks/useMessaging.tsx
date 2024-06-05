import { onMessage } from "firebase/messaging";
import { useEffect } from "react";
import { messaging } from "@/firebase/config";

const useMessaging = () => {
  useEffect(() => {
    onMessage(messaging, (payload) => {
      console.log("Message received. ", payload);

      if (payload.notification) {
        const { title, body } = payload.notification;
        if (title && body) {
          new Notification(title, { body });
        }
      }
    });
  }, []);
};

export default useMessaging;
