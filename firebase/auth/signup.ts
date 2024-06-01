import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { auth, db } from "../config";
import { doc, setDoc } from "firebase/firestore";

export default async function signUp(
  email: string,
  password: string,
  role: string
) {
  let result = null,
    error = null;
  try {
    result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;

    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      role,
    });
  } catch (e) {
    //! Handle errors here
    error = e;
  }

  return { result, error };
}
