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
import { dataMechanics } from "../components/pdfs/monthly_report";
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

const getAllPickupRequest = async (type, dateRange) => {
  const { min, max } = dateRange;
  try {
    const typo = type === 1 ? PICKUP_QUERY : WALKIN_QUERY;
    const QUERY = query(typo, where("release_date", ">=", min));
    const snap = await getDocs(QUERY);
    const ArrHolder = [];
    snap.forEach((element) => {
      const date = element.data().release_date;
      const dateHolder = new Date(date.toDate());
      if (element.data().status === "DONE") {
        if (dateHolder <= max) {
          ArrHolder.push({
            date: dateHolder.getDate(),
            income: element.data().price,
          });
        }
      }
    });

    const dataRelease = { count: null, price: null };
    ArrHolder.forEach((element) => {
      dataRelease.count += 1;
      dataRelease.price += element.income;
    });

    return dataRelease;
  } catch (error) {
    throw error;
  }
};

const getRequestPrintableData = async (
  year = new Date().getFullYear(),
  type = 0
) => {
  const qry_one = await getDocs(
    query(PICKUP_QUERY, where("status", "==", "DONE"))
  );
  const qry_two = await getDocs(
    query(WALKIN_QUERY, where("status", "==", "DONE"))
  );
  const arrayHolder = [];
  qry_one.forEach((value) => {
    const date = value.data().recieve_date.toDate().toString();
    if (new Date(date).getFullYear() === year) {
      arrayHolder.push({
        id: value.id,
        ...value.data(),
        request_type: "Pick-Up",
        recieve_date: date,
      });
    }
  });

  qry_two.forEach((value) => {
    const date = value.data().recieve_date.toDate().toString();
    if (new Date(date).getFullYear() === year) {
      arrayHolder.push({
        id: value.id,
        ...value.data(),
        request_type: "Walk-In",
        recieve_date: date,
      });
    }
  });

  const finalArr = [];

  arrayHolder.forEach((filter) => {
    if (filter.release_date !== undefined) {
      finalArr.push(filter);
    }
  });

  return dataMechanics(finalArr, type);
};

const FinanceService = {
  getAllIncomeForTheMonth,
  getAllPickupRequest,
  getRequestPrintableData,
};

export default FinanceService;
