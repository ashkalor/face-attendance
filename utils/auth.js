import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../config/firebase";

export const login = async (email, password) => {
  const response = await signInWithEmailAndPassword(auth, email, password);
  const token = response?.user?.stsTokenManager?.accessToken;
  return token;
};

export const signup = async (email, password) => {
  const response = await createUserWithEmailAndPassword(auth, email, password);
  const token = response?.user?.stsTokenManager?.accessToken;
  return token;
};

export const logout = async () => {
  await auth.signOut();
};
