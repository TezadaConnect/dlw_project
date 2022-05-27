import {
  where,
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
} from "@firebase/firestore";
import { firestore } from "../config/firebase_config";
import AuditTrailService, { ACTION_RECORD } from "./audit_trail_service";
import ProductService from "./product_service";

export const WALKIN_QUERY = collection(firestore, "walkin_requests");
export const PICKUP_QUERY = collection(firestore, "pickup_request");

export const tableEnum = {
  request: "request",
  clean: "clean",
  done: "done",
};

let SERVICE_LIST = [];

const serviceContent = (id) => {
  let value = "";
  SERVICE_LIST?.forEach((element) => {
    if (element.id === id) {
      value = element.service_name;
    }
  });
  return value;
};

const readRequest = async (is_walk = true) => {
  const QUERY = is_walk ? WALKIN_QUERY : PICKUP_QUERY;
  const request = [];
  const clean = [];
  const done = [];
  const snap = await getDocs(QUERY);

  await ProductService.getAllProduct().then((value) => {
    SERVICE_LIST = value;
  });

  try {
    snap?.forEach(async (item) => {
      if (item.data().status !== "REJECT") {
        if (!item.data().recieve_date) {
          if (item.data().table === tableEnum.request) {
            request?.push({
              id: item?.id,
              price: item?.data()?.price,
              content: serviceContent(item?.data()?.service_type) + " Service",
              service_id: item?.data()?.service_type,
              status: item?.data().status,
              user_id: item?.data().user_id,
            });
          }
          if (item.data().table === tableEnum.clean) {
            clean?.push({
              id: item?.id,
              price: item?.data()?.price,
              content: serviceContent(item?.data()?.service_type),
              service_id: item?.data()?.service_type,
              status: item?.data().status,
              user_id: item?.data().user_id,
            });
          }
          if (item.data().table === tableEnum.done) {
            done?.push({
              id: item?.id,
              price: item?.data()?.price,
              content: serviceContent(item?.data()?.service_type),
              service_id: item?.data()?.service_type,
              status: item?.data().status,
              user_id: item?.data().user_id,
            });
          }
        }
      }
    });
    return { request: request, clean: clean, done: done };
  } catch (error) {
    throw error;
  }
};

const requestTableModify = async (id, table, is_walk = true, moderator) => {
  const QUERY = is_walk ? WALKIN_QUERY : PICKUP_QUERY;
  const date = new Date();
  await updateDoc(doc(QUERY, id), {
    table: table,
    updated_at: date,
  });
  await AuditTrailService.addRecord(
    moderator,
    ACTION_RECORD[1],
    `${is_walk ? "Walkin" : "Pickup"} Request ${id} was moved to ${table}`
  );
};

const requestStatusModify = async (id, status, is_walk = true, moderator) => {
  const QUERY = is_walk ? WALKIN_QUERY : PICKUP_QUERY;
  const date = new Date();
  const status_cap = status.toUpperCase();

  if (status === "DONE") {
    return await updateDoc(doc(QUERY, id), {
      recieve_date: date,
      status: status_cap,
      updated_at: date,
    });
  }
  await updateDoc(doc(QUERY, id), {
    status: status_cap,
    updated_at: date,
  });

  await AuditTrailService.addRecord(
    moderator,
    ACTION_RECORD[1],
    `${
      is_walk ? "Walkin" : "Pickup"
    } Request ${id} Status was Updated to ${status}`
  );
};

const createNewRequest = async (value, is_walk = true, moderator) => {
  const { customer_name, service_type, address, contact, kilogram, price } =
    value;

  const date = new Date();
  const QUERY = is_walk ? WALKIN_QUERY : PICKUP_QUERY;
  const item = await addDoc(QUERY, {
    customer_name: customer_name,
    service_type: service_type,
    address: address,
    contact: contact,
    kilogram: kilogram,
    price: price,
    status: "WAITING",
    table: "request",
    create_at: date,
  });

  await AuditTrailService.addRecord(
    moderator,
    ACTION_RECORD[0],
    `${is_walk ? "Walkin" : "Pickup"} Request ${item.id} was Created`
  );
};

const updateRequest = async (id, value, is_walk = true, moderator = "") => {
  const { customer_name, service_type, address, contact, kilogram, price } =
    value;
  const date = new Date();
  const QUERY = is_walk ? WALKIN_QUERY : PICKUP_QUERY;
  await updateDoc(doc(QUERY, id), {
    customer_name: customer_name,
    service_type: service_type,
    address: address,
    contact: contact,
    kilogram: kilogram,
    price: price,
    updated_at: date,
  });
  await AuditTrailService.addRecord(
    moderator,
    ACTION_RECORD[1],
    `${is_walk ? "Walkin" : "Pickup"} Request ${id} was Updated`
  );
};

const readOneRequest = async (id, is_walk = true) => {
  const QUERY = is_walk ? WALKIN_QUERY : PICKUP_QUERY;
  const snap = await getDoc(doc(QUERY, id));
  return snap;
};

const GetAllMergeRequest = async () => {
  const qry_one = await getDocs(
    query(PICKUP_QUERY, where("status", "==", "DONE"))
  );
  const qry_two = await getDocs(
    query(WALKIN_QUERY, where("status", "==", "DONE"))
  );
  const arrayHolder = [];
  qry_one.forEach((value) => {
    const date = value.data().recieve_date.toDate().toString();
    arrayHolder.push({
      id: value.id,
      ...value.data(),
      request_type: "Pick-Up",
      recieve_date: date,
    });
  });

  qry_two.forEach((value) => {
    const date = value.data().recieve_date.toDate().toString();
    arrayHolder.push({
      id: value.id,
      ...value.data(),
      request_type: "Walk-In",
      recieve_date: date,
    });
  });

  console.log(arrayHolder);

  return arrayHolder.sort((a, b) => {
    return new Date(b.recieve_date) - new Date(a.recieve_date);
  });
};

const RequestService = {
  readRequest,
  requestTableModify,
  requestStatusModify,
  createNewRequest,
  updateRequest,
  readOneRequest,
  GetAllMergeRequest,
};
export default RequestService;
