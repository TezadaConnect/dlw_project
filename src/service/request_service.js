import {
  collection,
  setDoc,
  doc,
  getDocs,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "../config/firebase_config";
import axios from "axios";

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

  await axios
    .post("https://app.nativenotify.com/api/indie/notification", {
      subID: user_id,
      appId: 2746,
      appToken: "33W2w1mWUguk3y6DPPFDWL",
      title: "Your Item is listed as Pending!",
      message: "Please wait for the staff to accept your Request!",
    })
    .catch((err) => console.log(err.message));
};

const getTopTopProductBaseRequest = async () => {
  const snap = await getDocs(PICKUP_QUERY);
  const arrHolder = [];
  snap.forEach((element) => {
    arrHolder.push({ id: element.id, ...element.data() });
  });

  console.log(arrHolder);
};

const addFiveMunitesDelay = async (id) => {
  const dataSaver = new Date();
  await updateDoc(doc(PICKUP_QUERY, id), {
    release_date: new Date(dataSaver.getTime() + 1000 * 60 * 5),
  });
};

const getMyTransactions = async (id) => {
  const snap = await getDocs(
    query(PICKUP_QUERY, where("status", "==", "DONE"))
  );
  const arrHolder = [];
  snap.forEach((element) => {
    if (element.data().recieve_date !== null) {
      if (element.data().user_id === id) {
        const data = element.data().recieve_date.toDate().toString();
        arrHolder.push({
          id: element.id,
          ...element.data(),
          recieve_date: data,
        });
      }
    }
  });

  return arrHolder.sort(
    (a, b) => new Date(b.recieve_date) - new Date(a.recieve_date)
  );
};

const RequestService = {
  requestStatusModify,
  createNewRequest,
  getTopTopProductBaseRequest,
  addFiveMunitesDelay,
  getMyTransactions,
};
export default RequestService;
