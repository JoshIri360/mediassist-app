// Import and configure Firebase
importScripts(
  "https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js"
);

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyDOqbfiTGcdnFXMJsUCg4-vIWnSlH9T_ME",
  authDomain: "mediassist-hackathon.firebaseapp.com",
  projectId: "mediassist-hackathon",
  storageBucket: "mediassist-hackathon.appspot.com",
  messagingSenderId: "164581132526",
  appId: "1:164581132526:web:ee3fc087133164de57cbff",
  measurementId: "G-9101680QQY",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );

  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/firebase-logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

