require('dotenv').config();
const admin          = require('firebase-admin');
// const serviceAccount = require('./config/firebaseServiceAccountKey.json');
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "conpermisapp.firebasestorage.app"
});

module.exports = admin;


