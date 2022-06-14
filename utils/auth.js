import { auth } from "../config/firebase";

export const login = async (email, password) => {
  const response = await auth.signInWithEmailAndPassword(email, password);
  console.log(response);
};

export const signup = async (email, password) => {
  const response = await auth.createUserWithEmailAndPassword(email, password);
  console.log(response);
};
