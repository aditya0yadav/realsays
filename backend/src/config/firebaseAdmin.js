const admin = require("firebase-admin");

// You will need to download your service account key from Firebase Console
// and place it in a secure location (e.g., config/firebase-service-account.json)
// and reference it via environment variables.

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || "{}");

if (Object.keys(serviceAccount).length > 0) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

module.exports = admin;
