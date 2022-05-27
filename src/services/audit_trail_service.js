import { firestore } from "../config/firebase_config";
import { collection, setDoc, doc, getDocs, query } from "@firebase/firestore";
import { PRODUCT_QUERY } from "./product_service";

export const ACTION_RECORD = ["CREATE", "UPDATE", "REMOVE"];

const AUDIT_QRY = collection(firestore, "audit_trail");

const addRecord = async (user = "", action, desc) => {
  await setDoc(doc(AUDIT_QRY), {
    user: user,
    action: action,
    description: desc,
    date: new Date(),
  });
};

const readAllRecord = async () => {
  const snap = await getDocs(query(AUDIT_QRY));

  const arrHolder = [];
  snap?.forEach((element) => {
    const date = element.data().date.toDate().toString();
    arrHolder.push({ id: element.id, ...element.data(), date: date });
  });
  return arrHolder.sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
};

const AuditTrailService = { addRecord, readAllRecord };
export default AuditTrailService;
