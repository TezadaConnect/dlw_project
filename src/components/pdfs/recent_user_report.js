import jsPDF from "jspdf";

const recentUserGeneratePDF = (data) => {
  const doc = new jsPDF("l", "pt");

  doc.setFont("helvetica");
  doc.setFontSize(11);

  const tableColumn = [
    "ID",
    "Customer Name",
    "Contact No.",
    "Service",
    "Request Type",
    "Amount",
    "Date",
  ];
  const tableRows = [];

  let income = 0;

  // Setting Up table
  const tiks = data;
  // for each ticket pass all its data into an array
  tiks?.forEach((item) => {
    const ticketData = [
      item.id,
      item.customer_name,
      item.contact,
      item.service_type,
      item.request_type,
      item.price,
      item.recieve_date,
    ];
    tableRows.push(ticketData);
    income += parseFloat(item.price);
  });

  doc.setFont(undefined, "bold").setFontSize(14);
  doc.text(
    "RECENT CLIENT REPORT OF YEAR " + new Date().getFullYear(),
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
    "Date: " +
      new Date().toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
      }),
    doc.internal.pageSize.getWidth() / 2 - 40,
    50,
    {
      align: "center",
    }
  );

  doc.autoTable(tableColumn, tableRows, { startY: 60, fillColor: [0, 0, 0] });

  const finalY = doc.lastAutoTable.finalY;

  doc.setFont(undefined, "normal").setFontSize(7);
  doc.text("DLW 2022 - ALL RIGHTS RESERVED", 40, finalY + 15);

  doc.output("dataurlnewwindow");
};

export default recentUserGeneratePDF;
