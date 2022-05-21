import { collection } from "firebase/firestore";
import { firestore } from "../config/firebase_config";

export const QUERY_APP = collection(firestore, "app_config");
