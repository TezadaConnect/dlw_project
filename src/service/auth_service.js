import { async } from "@firebase/util";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import { collection, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
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
    return user;
  } catch (error) {
    throw error;
  }
};

/**
 * Signup Function
 * @param {object} values object with email and password keys and others
 */
const register = async (values) => {
  const { email, password, fname, lname, contact } = values;
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
      role: "client",
      contact: contact,
      terms: false,
    });

    return user;
  } catch (error) {
    throw error;
  }
};

const editProfile = async (values) => {
  const { email, fname, lname, contact } = values;
  const user_fname = (fname.charAt(0).toUpperCase() + fname.slice(1)).trim();
  const user_lname = (lname.charAt(0).toUpperCase() + lname.slice(1)).trim();
  let user = {};
  console.log(email);
  try {
    onAuthStateChanged(authentication, async (currentUser) => {
      if (currentUser) {
        await updateProfile(currentUser, {
          displayName: user_fname + " " + user_lname,
        });
        await updateEmail(currentUser, email).catch((err) => {
          throw new Error(err.message);
        });
        await updateDoc(doc(USERS_QUERY, currentUser.uid), {
          email: email,
          fname: user_fname,
          lname: user_lname,
          contact: contact,
        });
      }
      return user;
    });
  } catch (error) {
    throw error;
  }

  return user;
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

const changePassword = async (password) => {
  const user = authentication.currentUser;
  console.log(password + " " + user.uid);
  try {
    await updatePassword(user, password);
  } catch (error) {
    throw error;
  }
};

const updateProfileImage = async (value, file) => {
  const { img_path, userId } = value;
  try {
    if (img_path !== "") {
      const PRODDUC_DEL_REF = ref(storage, img_path);
      deleteObject(PRODDUC_DEL_REF);
    }

    const imgName = Math.round(new Date() / 1000) + "-" + file.name ?? "file";
    let img_url = "";
    const PRODUCT_IMG_REF = ref(storage, "app_img/" + imgName);
    const uploadImage = await uploadBytes(PRODUCT_IMG_REF, file);
    await getDownloadURL(uploadImage.ref).then((url) => (img_url = url));

    await updateDoc(doc(USERS_QUERY, userId), {
      img_url: img_url,
      img_alt: "app-icn-alt",
      img_path: PRODUCT_IMG_REF.fullPath,
    });
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
  editProfile,
  changePassword,
  updateProfileImage,
};

export default AuthService;
