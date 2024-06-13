import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
      clientEmail: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY.replace(
        /\\n/g,
        "\n"
      ),
    }),
    databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECTID}.firebaseio.com`,
  });
}

const db = admin.firestore();
const messaging = admin.messaging();

export { db, messaging };
