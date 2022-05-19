import {
  collection,
  setDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
} from "@firebase/firestore";
import { async } from "@firebase/util";
import { firestore } from "../config/firebase_config";

export const PICKUP_QUERY = collection(firestore, "pickup_request");
export const WALKIN_QUERY = collection(firestore, "walkin_requests");

const getAllIncomeForTheMonth = async (dateRange, type = 0) => {
  const { max } = dateRange;

  try {
    const data = await queryIdentifier(type, dateRange);

    return graphComputation(data, max);
  } catch (error) {
    throw error;
  }
};

const graphComputation = (ArrHolder = [], max = 0) => {
  const dateDay = new Date(max);
  const maxDay = new Date(dateDay.getFullYear(), dateDay.getMonth() + 1, 0);
  const graphValue = [];

  const ArrayMonth = [
    "January",
    "Ferbruary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  for (let index = 0; index < maxDay.getDate(); index++) {
    let total_price = 0;
    let dateNumber = 0;
    ArrHolder?.forEach((element) => {
      if (element.date == index + 1) {
        total_price += element.income;
        dateNumber = element.date;
      }
    });
    if (total_price > 0) {
      graphValue.push({
        date:
          ArrayMonth[dateDay.getMonth()] +
          " " +
          dateNumber +
          ", " +
          dateDay.getFullYear(),
        income: total_price,
      });
    }
  }

  return graphValue;
};

const queryIdentifier = async (type, dateRange) => {
  let ArrayHoldsData = [];
  if (type === 1) {
    const QUERY = query(
      PICKUP_QUERY,
      where("release_date", ">=", dateRange.min)
    );
    await graphQueryGetter(QUERY, dateRange).then((res) => {
      console.log(res);
      return (ArrayHoldsData = res);
    });
  }

  if (type === 2) {
    const QUERY = query(
      WALKIN_QUERY,
      where("release_date", ">=", dateRange.min)
    );
    await graphQueryGetter(QUERY, dateRange).then((res) => {
      console.log(res);
      return (ArrayHoldsData = res);
    });
  }

  if (type === 0) {
    const Q1 = query(PICKUP_QUERY, where("release_date", ">=", dateRange.min));
    const Q2 = query(WALKIN_QUERY, where("release_date", ">=", dateRange.min));
    let arr1 = [];
    let arr2 = [];
    await graphQueryGetter(Q1, dateRange).then((res) => {
      arr1 = [...res];
    });
    await graphQueryGetter(Q2, dateRange).then((res) => {
      arr2 = [...res];
    });
    ArrayHoldsData = [...arr1, ...arr2];
  }

  return ArrayHoldsData;
};

const graphQueryGetter = async (query, dateRange) => {
  const snap = await getDocs(query);
  const ArrHolder = [];
  snap.forEach((element) => {
    const date = element.data().release_date;
    const dateHolder = new Date(date.toDate());
    if (element.data().status === "DONE") {
      if (dateHolder <= dateRange.max) {
        ArrHolder.push({
          date: dateHolder.getDate(),
          income: element.data().price,
        });
      }
    }
  });
  return ArrHolder;
};

// const serviceContent = (id) => {
//   let value = "";
//   SERVICE_LIST?.forEach((element) => {
//     if (element.id === id) {
//       value = element.service_name;
//     }
//   });
//   return value;
// };

// const readRequest = async (is_walk = true) => {
//   const QUERY = is_walk ? WALKIN_QUERY : PICKUP_QUERY;
//   const request = [];
//   const clean = [];
//   const done = [];
//   const snap = await getDocs(QUERY);

//   await ProductService.getAllProduct().then((value) => {
//     SERVICE_LIST = value;
//   });

//   try {
//     snap?.forEach(async (item) => {
//       if (item.data().table === tableEnum.request) {
//         request?.push({
//           id: item?.id,
//           price: item?.data()?.price,
//           content: serviceContent(item?.data()?.service_type) + " Service",
//           service_id: item?.data()?.service_type,
//           status: item?.data().status,
//         });
//       }
//       if (item.data().table === tableEnum.clean) {
//         clean?.push({
//           id: item?.id,
//           price: item?.data()?.price,
//           content: serviceContent(item?.data()?.service_type),
//           service_id: item?.data()?.service_type,
//           status: item?.data().status,
//         });
//       }
//       if (item.data().table === tableEnum.done) {
//         done?.push({
//           id: item?.id,
//           price: item?.data()?.price,
//           content: serviceContent(item?.data()?.service_type),
//           service_id: item?.data()?.service_type,
//           status: item?.data().status,
//         });
//       }
//     });
//     return { request: request, clean: clean, done: done };
//   } catch (error) {
//     throw error;
//   }
// };

// const requestTableModify = async (id, table, is_walk = true) => {
//   const QUERY = is_walk ? WALKIN_QUERY : PICKUP_QUERY;
//   const date = new Date();
//   await updateDoc(doc(QUERY, id), {
//     table: table,
//     updated_at: date,
//   });
// };

// const requestStatusModify = async (id, status, is_walk = true) => {
//   const QUERY = is_walk ? WALKIN_QUERY : PICKUP_QUERY;
//   const date = new Date();
//   const status_cap = status.toUpperCase();
//   await updateDoc(doc(QUERY, id), {
//     status: status_cap,
//     updated_at: date,
//   });
// };

// const createNewRequest = async (value, is_walk = true) => {
//   const { customer_name, service_type, address, contact, kilogram, price } =
//     value;

//   const date = new Date();
//   const QUERY = is_walk ? WALKIN_QUERY : PICKUP_QUERY;
//   await setDoc(doc(QUERY), {
//     customer_name: customer_name,
//     service_type: service_type,
//     address: address,
//     contact: contact,
//     kilogram: kilogram,
//     price: price,
//     status: "WAITING",
//     table: "request",
//     create_at: date,
//   });
// };

// const updateRequest = async (id, value, is_walk = true) => {
//   const { customer_name, service_type, address, contact, kilogram, price } =
//     value;
//   const date = new Date();
//   const QUERY = is_walk ? WALKIN_QUERY : PICKUP_QUERY;
//   await updateDoc(doc(QUERY, id), {
//     customer_name: customer_name,
//     service_type: service_type,
//     address: address,
//     contact: contact,
//     kilogram: kilogram,
//     price: price,
//     updated_at: date,
//   });
// };

// const readOneRequest = async (id, is_walk = true) => {
//   const QUERY = is_walk ? WALKIN_QUERY : PICKUP_QUERY;
//   const snap = await getDoc(doc(QUERY, id));
//   return snap;
// };

const FinanceService = {
  getAllIncomeForTheMonth,
};

export default FinanceService;
