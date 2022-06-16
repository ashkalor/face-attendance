import {
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";

export const addUserToDb = async (user) => {
  await setDoc(doc(db, "users", user.id), user);
};

export const getUserFromDb = async (userId) => {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  }
};

export const updateUserInDb = async (user) => {
  await updateDoc(doc(db, "users", user.id), user);
};
