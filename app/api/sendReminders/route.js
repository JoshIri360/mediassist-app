import { getFirestore, collection, getDocs } from "firebase/firestore";
import admin from "firebase-admin";
import { app } from "@/firebase/config";

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
}

export async function POST(req) {
  console.log("Post request received");
  try {
    const db = getFirestore(app);
    const usersSnapshot = await getDocs(collection(db, "users"));

    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      const medications = userData.medications || [];
      const fcmToken = userData.fcmToken;

      if (!fcmToken) {
        console.log(`No FCM token found for user ${userDoc.id}`);
        continue;
      }

      for (const med of medications) {
        const now = new Date();
        const startDate = new Date(med.startDate);
        const endDate = new Date(med.endDate);

        // Check if the current date falls within the medication's start and end dates
        if (now >= startDate && now <= endDate) {
          const timesToTake = med.times.filter((time) => {
            const [hours, minutes] = time.split(":").map(Number);
            const medTime = new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate(),
              hours,
              minutes
            );
            const timeDiff = Math.abs(medTime.getTime() - now.getTime());
            const oneHourInMs = 60 * 60 * 1000; // One hour in milliseconds

            // Check if the current time is within one hour of the medication time
            return timeDiff <= oneHourInMs;
          });

          if (timesToTake.length > 0) {
            const message = {
              notification: {
                title: `Medication Reminder: ${med.name}`,
                body: `It's time to take your ${med.dosage} dose of ${
                  med.name
                }. Times: ${timesToTake.join(", ")}`,
              },
              token: fcmToken,
            };

            try {
              const response = await admin.messaging().send(message);
              console.log("Successfully sent message:", response);
            } catch (error) {
              console.log("Error sending message:", error);
            }
          }
        }
      }
    }

    return new Response(JSON.stringify({ message: "Reminders sent" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error sending reminders: ", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}

export async function GET() {
  return new Response(JSON.stringify({ error: "Method not allowed" }), {
    status: 405,
  });
}
