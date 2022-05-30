import { collection, getDocs, query, where } from "@firebase/firestore";
import { firestore } from "../config/firebase_config";
import { PRODUCT_QUERY } from "./product_service";
import { convertProducts, dataRequest } from "./request_service";
export const PICKUP_QUERY = collection(firestore, "pickup_request");
export const WALKIN_QUERY = collection(firestore, "walkin_requests");

// const getRequestPrintableData = async (
//   year = new Date().getFullYear(),
//   type = 0
// ) => {
//   const qry_one = await getDocs(
//     query(PICKUP_QUERY, where("status", "==", "DONE"))
//   );
//   const qry_two = await getDocs(
//     query(WALKIN_QUERY, where("status", "==", "DONE"))
//   );
//   const arrayHolder = [];
//   qry_one.forEach((value) => {
//     const date = value.data().recieve_date.toDate().toString();
//     if (new Date(date).getFullYear() === year) {
//       arrayHolder.push({
//         id: value.id,
//         ...value.data(),
//         request_type: "Pick-Up",
//         recieve_date: date,
//       });
//     }
//   });

//   qry_two.forEach((value) => {
//     const date = value.data().recieve_date.toDate().toString();
//     if (new Date(date).getFullYear() === year) {
//       arrayHolder.push({
//         id: value.id,
//         ...value.data(),
//         request_type: "Walk-In",
//         recieve_date: date,
//       });
//     }
//   });

//   const finalArr = [];

//   arrayHolder.forEach((filter) => {
//     if (filter.release_date !== undefined) {
//       finalArr.push(filter);
//     }
//   });

//   return dataMechanics(finalArr, type);
// };

const getAllRequestGenerator = async () => {
  const product = await getDocs(PRODUCT_QUERY);
  const productList = [];
  product?.forEach((element) => {
    productList.push({ ...element.data(), id: element.id });
  });

  const qry_one = await getDocs(
    query(PICKUP_QUERY, where("status", "==", "DONE"))
  );
  const qry_two = await getDocs(
    query(WALKIN_QUERY, where("status", "==", "DONE"))
  );
  const arrayHolder = [];
  qry_one.forEach((value) => {
    if (value.data().recieve_date !== undefined) {
      const date = value.data().recieve_date.toDate().toString();

      arrayHolder.push({
        id: value.id,
        ...value.data(),
        service_type: convertProducts(value.data().service_type, productList),
        request_type: "Pick-Up",
        recieve_date: dataRequest(date),
      });
    }
  });

  qry_two.forEach((value) => {
    if (value.data().recieve_date !== undefined) {
      const date = value.data().recieve_date.toDate().toString();

      arrayHolder.push({
        id: value.id,
        ...value.data(),
        service_type: convertProducts(value.data().service_type, productList),
        request_type: "Walk-In",
        recieve_date: dataRequest(date),
      });
    }
  });

  console.log(arrayHolder.length);

  return arrayHolder.sort((a, b) => {
    return new Date(b.recieve_date) - new Date(a.recieve_date);
  });
};

const FinanceService = {
  getAllRequestGenerator,
};

export default FinanceService;

const getDataBaseOnDate = (data = [], requestDate) => {
  let pickUpCount = 0;
  let WalkInCount = 0;
  let incomeCount = 0;
  const dateFrom = new Date(requestDate);
  const requestLists = data;

  requestLists.forEach((element) => {
    const recieved = new Date(element.recieve_date);
    if (
      recieved.getDate() === dateFrom.getDate() &&
      recieved.getMonth() === dateFrom.getMonth() &&
      recieved.getFullYear() === dateFrom.getFullYear()
    ) {
      incomeCount += parseFloat(element.price);
      if (element.request_type === "Walk-In") WalkInCount += 1;
      if (element.request_type === "Pick-Up") pickUpCount += 1;
    }
  });

  const date = new Date(requestDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const totalRequestCount = pickUpCount + WalkInCount;

  return { date, totalRequestCount, pickUpCount, WalkInCount, incomeCount };
};

export const arrayOfDateGenerator = (
  data = [],
  from = new Date(),
  to = new Date()
) => {
  const DATALIST = [];

  const counterDate = new Date(from);
  const fromDate = new Date(to);

  while (counterDate <= fromDate) {
    DATALIST.push(getDataBaseOnDate(data, counterDate));
    counterDate.setDate(counterDate.getDate() + 1);
  }

  return DATALIST;
};

const graphDataGenerator = (data = [], requestDate) => {
  let incomeCount = 0;
  const dateFrom = new Date(requestDate);
  const requestLists = data;
  let pickup = 0;
  let walkin = 0;
  requestLists.forEach((element) => {
    const recieved = new Date(element.recieve_date);
    if (
      recieved.getDate() === dateFrom.getDate() &&
      recieved.getMonth() === dateFrom.getMonth() &&
      recieved.getFullYear() === dateFrom.getFullYear()
    ) {
      incomeCount += parseFloat(element.price);
      if (element.request_type === "Walk-In") walkin += 1;
      if (element.request_type === "Pick-Up") pickup += 1;
    }
  });

  const date = new Date(requestDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const grapData = {
    date: date,
    income: incomeCount,
  };

  return {
    grapData,
    pickup,
    walkin,
  };
};

export const graphArrayGenerator = (data = [], requestDate = new Date()) => {
  const preview = new Date(requestDate);
  const dateFrom = new Date(preview.getFullYear(), preview.getMonth(), 1);
  const dateTo = new Date(preview.getFullYear(), preview.getMonth() + 1, 0);

  const counterDate = new Date(dateFrom);

  const DATELIST = [];
  let pickupCount = 0;
  let walkinCount = 0;
  let totalIncome = 0;
  while (counterDate <= dateTo) {
    const { grapData, walkin, pickup } = graphDataGenerator(data, counterDate);
    DATELIST.push(grapData);
    totalIncome += parseFloat(grapData.income);
    walkinCount += parseFloat(walkin);
    pickupCount += parseFloat(pickup);
    counterDate.setDate(counterDate.getDate() + 1);
  }

  console.log(totalIncome);
  return { DATELIST, pickupCount, walkinCount, totalIncome };
};
