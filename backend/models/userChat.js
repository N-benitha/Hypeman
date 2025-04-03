import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import fApp from "../firebaseconfig";

const db = getFirestore(fApp);

// Function to create the user document with an empty "chats" field (array)
async function defineUserCollection(userId="8zQuvCkuigg5jrPDEH2wSDzDwli2") {
  const userRef = doc(db, "users", userId);

  // Define the user document with an empty array for chats (acts as a placeholder)
  await setDoc(userRef, {
    userId: userId,
    createdAt: new Date(),
    chats: [], // Placeholder since Firestore does not allow empty subcollections
  });

  console.log(`User document for ${userId} created successfully with an empty chats array.`);
}

// Example usage
defineUserCollection("user123");