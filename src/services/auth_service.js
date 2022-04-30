import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  sendPasswordResetEmail,
} from "@firebase/auth";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from "@firebase/firestore";

import { authentication, firestore } from "../config/firebase_config";

export const USERS_QUERY = collection(firestore, "users");

/**
 * Login Function
 * @param {object} values object with email and password keys
 * @returns id
 */
const login = async (values) => {
  let { email, password } = values;
  try {
    const { user } = await signInWithEmailAndPassword(
      authentication,
      email.trim(),
      password
    );

    const userInfo = await getDoc(doc(USERS_QUERY, user.uid));

    if (userInfo.exists()) {
      if (userInfo.data().role === "client") {
        throw new Error("You're not an admin");
      }
    }
    return {
      user: user,
      role: userInfo.data().role,
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Signup Function
 * @param {object} values object with email and password keys and others
 */
const register = async (values) => {
  const { email, password, fname, lname, role } = values;
  try {
    const user_fname = (fname.charAt(0).toUpperCase() + fname.slice(1)).trim();
    const user_lname = (lname.charAt(0).toUpperCase() + lname.slice(1)).trim();
    const { user } = await createUserWithEmailAndPassword(
      authentication,
      email.trim(),
      password
    );

    await updateProfile(user, {
      displayName: user_fname + " " + user_lname,
    });

    await setDoc(doc(USERS_QUERY, user.uid), {
      email,
      fname: user_fname,
      lname: user_lname,
      role,
      terms: false,
    });

    return user;
  } catch (error) {
    throw error;
  }
};

const readAgreement = async (id) => {
  try {
    const snap = await getDoc(doc(USERS_QUERY, id));
    if (snap.exists()) {
      return snap.data().terms;
    }
    throw new Error("Opps something went wrong");
  } catch (error) {
    throw error;
  }
};

const modifyAgreement = async (id) => {
  try {
    await updateDoc(doc(USERS_QUERY, id), { terms: true });
  } catch (error) {
    throw error;
  }
};

const sendResetPassword = async (email) => {
  sendPasswordResetEmail(USERS_QUERY, email);
};
/**
 * logout current user Function
 */
const logout = async () => {
  try {
    await signOut(authentication);
  } catch (error) {
    throw error;
  }
};

/**
 * An object that holds authentication functionalities
 */
const AuthService = {
  login,
  register,
  logout,
  readAgreement,
  modifyAgreement,
  sendResetPassword,
};

export default AuthService;
