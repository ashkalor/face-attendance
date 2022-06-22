import { doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
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

export const updateAttendanceInDb = async (attendance, userId) => {
  const docRef = doc(db, "users", userId);
  const arrUnion = arrayUnion(attendance);
  await updateDoc(docRef, { attendance: arrUnion });
};

export const getAttendanceFromDb = async (userId) => {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data().attendance;
  }
};

export const addDatatoDb = async (data) => {
  const docRef = doc(db, "users", userId);
  await updateDoc(docRef, { data: data });
};
