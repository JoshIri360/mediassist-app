import { db, messaging } from "../../../firebaseAdmin";

export async function POST(req) {
  try {
    const usersSnapshot = await db.collection("users").get();

    usersSnapshot.forEach(async (userDoc) => {
      const userData = userDoc.data();
      const medications = userData.medications || [];

      medications.forEach((med) => {
        const now = new Date();
        const startDate = new Date(med.startDate);
        const endDate = new Date(med.endDate);

        if (now >= startDate && now <= endDate) {
          const payload = {
            notification: {
              title: `Medication Reminder: ${med.name}`,
              body: `It's time to take your ${med.dosage} dose of ${med.name}.`,
            },
          };

          messaging
            .sendToDevice(userData.deviceToken, payload)
            .then((response) => {
              console.log("Successfully sent message:", response);
            })
            .catch((error) => {
              console.log("Error sending message:", error);
            });
        }
      });
    });

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
