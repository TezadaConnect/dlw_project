import {
  collection,
  setDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "@firebase/firestore";
import { firestore } from "../config/firebase_config";
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
      if (item.data().table === tableEnum.request) {
        request?.push({
          id: item?.id,
          price: item?.data()?.price,
          content: serviceContent(item?.data()?.service_type) + " Service",
          service_id: item?.data()?.service_type,
          status: item?.data().status,
        });
      }
      if (item.data().table === tableEnum.clean) {
        clean?.push({
          id: item?.id,
          price: item?.data()?.price,
          content: serviceContent(item?.data()?.service_type),
          service_id: item?.data()?.service_type,
          status: item?.data().status,
        });
      }
      if (item.data().table === tableEnum.done) {
        done?.push({
          id: item?.id,
          price: item?.data()?.price,
          content: serviceContent(item?.data()?.service_type),
          service_id: item?.data()?.service_type,
          status: item?.data().status,
        });
      }
    });
    return { request: request, clean: clean, done: done };
  } catch (error) {
    throw error;
  }
};

const requestTableModify = async (id, table, is_walk = true) => {
  const QUERY = is_walk ? WALKIN_QUERY : PICKUP_QUERY;
  const date = new Date();
  await updateDoc(doc(QUERY, id), {
    table: table,
    updated_at: date,
  });
};

const requestStatusModify = async (id, status, is_walk = true) => {
  const QUERY = is_walk ? WALKIN_QUERY : PICKUP_QUERY;
  const date = new Date();
  const status_cap = status.toUpperCase();

  if (status === "DONE") {
    return await updateDoc(doc(QUERY, id), {
      release_date: date,
      status: status_cap,
      updated_at: date,
    });
  }
  await updateDoc(doc(QUERY, id), {
    status: status_cap,
    updated_at: date,
  });
};

const createNewRequest = async (value, is_walk = true) => {
  const { customer_name, service_type, address, contact, kilogram, price } =
    value;

  const date = new Date();
  const QUERY = is_walk ? WALKIN_QUERY : PICKUP_QUERY;
  await setDoc(doc(QUERY), {
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
};

const updateRequest = async (id, value, is_walk = true) => {
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
};

const readOneRequest = async (id, is_walk = true) => {
  const QUERY = is_walk ? WALKIN_QUERY : PICKUP_QUERY;
  const snap = await getDoc(doc(QUERY, id));
  return snap;
};

const RequestService = {
  readRequest,
  requestTableModify,
  requestStatusModify,
  createNewRequest,
  updateRequest,
  readOneRequest,
};
export default RequestService;
