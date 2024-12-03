const admin = require('firebase-admin');
const serviceAccount = require('./src/asset/serviceAccountKey.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore(); // Initialize Firestore

// Function to check if a user exists
async function checkUserExists(uid) {
  try {
    const userRecord = await admin.auth().getUser(uid);
    console.log(`User exists: ${userRecord.email}`);
    return true;
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      console.error(`User with UID: ${uid} not found.`);
    } else {
      console.error('Error checking user existence:', error);
    }
    return false;
  }
}

// Function to set custom user claims
async function setCustomUserClaims(uid, role) {
  if (await checkUserExists(uid)) {
    try {
      // Set custom claims
      await admin.auth().setCustomUserClaims(uid, { role });
      console.log(`Role '${role}' has been assigned to user with UID: ${uid}`);

      // Update Firestore with the role (optional)
      const userRef = db.collection('users').doc(uid);
      await userRef.set({ role }, { merge: true });
      console.log(`Firestore updated for UID: ${uid} with role: ${role}`);
    } catch (error) {
      console.error('Error assigning custom claims:', error);
    }
  } else {
    console.error('User with the specified UID does not exist.');
  }
}

// Example usage: Assign 'admin' role to a specific user
setCustomUserClaims('8EzZbG5jGmRMkZtU0TxcTFqzh9z2', 'admin');
