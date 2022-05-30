import jsPDF from "jspdf";
import "jspdf-autotable";

const MONTH = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
];

const selectedDateReport = (data, datePick) => {
  const doc = new jsPDF("p", "pt");

  doc.setFont("helvetica");
  doc.setFontSize(11);
  const datePickConvert = {
    dateTo: new Date(datePick.to).toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    }),
    dateFrom: new Date(datePick.from).toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    }),
  };
  const tableColumn = [
    "Date",
    "Total Requests",
    "No. of Pickup",
    "No. Walkin",
    "Income",
  ];
  const tableRows = [];

  let income = 0;
  let count = 0;

  // Setting Up table
  const tiks = data;
  // for each ticket pass all its data into an array
  tiks?.forEach((item) => {
    const ticketData = [
      item.date,
      item.totalRequestCount,
      item.pickUpCount,
      item.WalkInCount,
      parseFloat(item.incomeCount),
    ];
    tableRows.push(ticketData);
    income += parseFloat(item.incomeCount);
    count += parseFloat(item.totalRequestCount);
  });

  // const title = dateType.type === 0 ? "MONTHLY" : "WEEKLY";
  doc.setFont(undefined, "bold").setFontSize(14);
  doc.text(
    "INCOME REPORT OF " +
      datePickConvert.dateFrom +
      " TO " +
      datePickConvert.dateTo,
    doc.internal.pageSize.getWidth() / 2,
    30,
    {
      align: "center",
    }
  );

  // Setting Up Other information
  doc.setFont(undefined, "normal").setFontSize(11);
  doc.text("Total Income: " + income, 40, 50);

  doc.setFont(undefined, "normal").setFontSize(11);
  doc.text(
    "Total Request: " + count,
    doc.internal.pageSize.getWidth() / 2,
    50,
    {
      align: "center",
    }
  );

  doc.setFont(undefined, "normal").setFontSize(11);
  doc.text(
    "Date: " +
      new Date().toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
      }),
    doc.internal.pageSize.getWidth() - 40,
    50,
    {
      align: "right",
    }
  );

  doc.autoTable(tableColumn, tableRows, { startY: 60, fillColor: [0, 0, 0] });

  const finalY = doc.lastAutoTable.finalY;

  doc.setFont(undefined, "normal").setFontSize(7);
  doc.text("DLW 2022 - ALL RIGHTS RESERVED", 40, finalY + 15);

  doc.output("dataurlnewwindow");
};

export default selectedDateReport;

// export const dataMechanics = (
//   data,
//   type = 0,
//   week = new Date().getFullYear()
// ) => {
//   if (type == 1) {
//     return weeklyData(data, week);
//   }
//   return monthlyData(data);
// };

// const weeklyData = (dataFromFirebase = [], week) => {
//   const lastWeek = new Date("December 31, " + week);
//   const lastDate = new Date(lastWeek.getFullYear(), 0, 1);
//   const lastday = Math.floor((lastWeek - lastDate) / (24 * 60 * 60 * 1000));
//   const lastWeekNumber = Math.ceil(lastday / 7);

//   const objectMain = {};
//   const arrayMain = [];

//   for (let index = 0; index <= lastWeekNumber; index++) {
//     dataFromFirebase.forEach((el) => {
//       const weekStart = new Date(el.recieve_date);

//       const dateStart = new Date(weekStart.getFullYear(), 0, 1);
//       const dayStart = Math.floor(
//         (weekStart - dateStart) / (24 * 60 * 60 * 1000)
//       );
//       const weekStartNumber = Math.ceil(dayStart / 7);
//       if (weekStartNumber === index) {
//         if (objectMain[index] === undefined) {
//           objectMain[index] = [];
//         }
//         objectMain[index].push(el);
//       }
//     });
//   }

//   let dataType = {
//     date: "",
//     pickup: 0,
//     walking: 0,
//     income: 0,
//   };

//   for (let index = 0; index < lastWeekNumber; index++) {
//     if (objectMain[index] !== undefined) {
//       objectMain[index].forEach((item) => {
//         dataType.date = "Week " + index;

//         if (item.request_type === "Walk-In")
//           dataType.walking = dataType.walking + 1;

//         if (item.request_type === "Pick-Up")
//           dataType.pickup = dataType.pickup + 1;

//         dataType.income = parseFloat(dataType.income) + parseFloat(item.price);
//       });

//       arrayMain.push(dataType);
//       dataType = {
//         date: "",
//         pickup: 0,
//         walking: 0,
//         income: 0,
//       };
//     }
//   }
//   return arrayMain;
// };

// const monthlyData = (dataFromFirebase = []) => {
//   const arrayMain = [];
//   const objectMain = {};
//   dataFromFirebase.forEach((element) => {
//     const date = new Date(element.recieve_date);
//     for (let index = 0; index < 12; index++) {
//       if (element.release_date !== undefined) {
//         if (date.getMonth() === index) {
//           if (objectMain[MONTH[index]] === undefined) {
//             objectMain[MONTH[index]] = [];
//           }
//           objectMain[MONTH[index]].push(element);
//         }
//       }
//     }
//   });

//   let dataType = {
//     date: "",
//     pickup: 0,
//     walking: 0,
//     income: 0,
//   };

//   for (let index = 0; index < 12; index++) {
//     if (objectMain[MONTH[index]] !== undefined) {
//       objectMain[MONTH[index]].forEach((item) => {
//         dataType.date = MONTH[index];

//         if (item.request_type === "Walk-In")
//           dataType.walking = dataType.walking + 1;

//         if (item.request_type === "Pick-Up")
//           dataType.pickup = dataType.pickup + 1;

//         dataType.income = parseFloat(dataType.income) + parseFloat(item.price);
//       });
//       arrayMain.push(dataType);
//       dataType = {
//         date: "",
//         pickup: 0,
//         walking: 0,
//         income: 0,
//       };
//     }
//   }

//   return sortMonth(arrayMain);
// };

// const sortMonth = (arr = []) => {
//   return arr.sort((a, b) => MONTH.indexOf(a.date - b.date));
// };
