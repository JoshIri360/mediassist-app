import admin from "firebase-admin";

if (!admin.apps.length) {
  console.log(
    "Private Key 2: ",
    process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
  );
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
    databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECTID}.firebaseio.com`,
  });
}

const db = admin.firestore();
const messaging = admin.messaging();

export { db, messaging };
