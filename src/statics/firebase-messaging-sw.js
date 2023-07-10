importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: "AIzaSyBKed8DEWi0Gk1-40_eas3Byr8Ln_WjEeQ",
    authDomain: "notifications-edc9c.firebaseapp.com",
    projectId: "notifications-edc9c",
    storageBucket: "notifications-edc9c.appspot.com",
    messagingSenderId: "626515463422",
    appId: "1:626515463422:web:5d74016b36dcbe4b6629af",
    measurementId: "G-F7FC44SSCV"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log(
      '[firebase-messaging-sw.js] Received background message ',
      payload
    );
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: null,
    };
  
    self.registration.showNotification(notificationTitle, notificationOptions);
});