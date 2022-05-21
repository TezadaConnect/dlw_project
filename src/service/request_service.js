import {
  collection,
  setDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "../config/firebase_config";

export const PICKUP_QUERY = collection(firestore, "pickup_request");

const requestStatusModify = async (id, status) => {
  const QUERY = PICKUP_QUERY;
  const date = new Date();
  const status_cap = status.toUpperCase();
  await updateDoc(doc(QUERY, id), {
    status: status_cap,
    updated_at: date,
  });
};

const createNewRequest = async (value) => {
  const { customer_name, service_type, address, contact, load, user_id } =
    value;

  const date = new Date();
  const release_date = new Date(date.getTime() + 1000 * 60 * 60 * 24);
  const rate = JSON.parse(load);
  const QUERY = PICKUP_QUERY;
  await setDoc(doc(QUERY), {
    customer_name: customer_name,
    service_type: service_type,
    address: address,
    contact: contact,
    kilo: rate.kilo,
    price: rate.price,
    user_id: user_id,
    status: "WAITING",
    table: "request",
    release_date: release_date,
    create_at: date,
  });
};

const getTopTopProductBaseRequest = async () => {
  const snap = await getDocs(PICKUP_QUERY);
  const arrHolder = [];
  snap.forEach((element) => {
    arrHolder.push({ id: element.id, ...element.data() });
  });

  console.log(arrHolder);
};

const RequestService = {
  requestStatusModify,
  createNewRequest,
  getTopTopProductBaseRequest,
};
export default RequestService;
