const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");

const serviceAccount = require("./dlw-backend-firebase-adminsdk-21m7p-286216270a.json");

const ADMIN_CONFIG = {
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://dlw-backend-default-rtdb.asia-southeast1.firebasedatabase.app",
};

const firebase = admin.initializeApp(ADMIN_CONFIG);
exports.ADMIN_AUTH = firebase.auth();
exports.ADMIN_FIRESTORE = firebase.firestore();
