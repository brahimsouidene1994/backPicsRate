const {
    APP_KEY,
    AUTH_DOMAINE,
    PROJECT_ID,
    STORAGE_BUCKET,
    MASSAGING_SENDER_ID,
    APP_ID,
    MEASUREMENT_ID
  } = process.env;
const firebaseConfig = {
    apiKey: APP_KEY,
    authDomain: AUTH_DOMAINE,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: MASSAGING_SENDER_ID,
    appId: APP_ID,
    measurementId: MEASUREMENT_ID
};
module.exports = firebaseConfig