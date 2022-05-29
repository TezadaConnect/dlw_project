import React, { useEffect, useMemo, useState } from "react";
import { usePagination, useTable } from "react-table";
import FinanceService from "../../services/finance_service";
import generatePDF from "../pdfs/monthly_report";
import DatePicker from "react-datepicker";

const PrintableCustomerTable = () => {
  const [client, setClient] = useState([]);
  const [selectableDate, setSelectableDate] = useState({
    year: new Date().getFullYear(),
    type: 0,
  });

  const columns = useMemo(
    () => [
      {
        Header: "Date",
        accessor: "date",
      },
      {
        Header: "Number of Pickup",
        accessor: "pickup",
      },
      {
        Header: "Number of Walkin.",
        accessor: "walking",
      },
      {
        Header: "Income",
        accessor: "income",
      },
    ],
    []
  );

  const data = useMemo(
    () => client, // eslint-disable-next-line react-hooks/exhaustive-deps
    [client]
  );

  useEffect(() => {
    FinanceService.getRequestPrintableData(
      selectableDate.year,
      selectableDate.type
    )
      .then((res) => {
        setClient(res);
      })
      .catch((err) => console.log(err.message));
  }, [selectableDate]);

  return (
    <React.Fragment>
      <div className="mb-5 flex flex-row justify-between items-center">
        <div className="font-bold text-2xl">
          {selectableDate.type === 0 ? "MONTHLY " : "WEEKLY "}
          REPORT OF YEAR{" "}
          {selectableDate.year !== undefined
            ? selectableDate.year
            : new Date().getFullYear()}
        </div>
        <div className="flex flex-row gap-2">
          <div className="text-base">
            <DatePicker
              onChange={(date) => {
                setSelectableDate({
                  ...selectableDate,
                  year: new Date(date).getFullYear(),
                });
              }}
              className="text-base appearance-none p-3 bg-gray-100 box-border border border-gray-300 rounded focus:outline-none focus:border-gray-600 object-contain"
              dateFormat="yyyy"
              showYearPicker
            />
          </div>
          <button
            className="px-5 py-3 rounded bg-black text-white hover:bg-gray-900 active:translate-y-1"
            onClick={() => setSelectableDate({ ...selectableDate, type: 1 })}
          >
            Weekly
          </button>

          <button
            className="px-5 py-3 rounded bg-black text-white hover:bg-gray-900 active:translate-y-1"
            onClick={() => setSelectableDate({ ...selectableDate, type: 0 })}
          >
            Monthly
          </button>

          <button
            className="px-5 py-3 rounded bg-black text-white hover:bg-gray-900 active:translate-y-1"
            onClick={() =>
              window.open(generatePDF(client, selectableDate), "_blank")
            }
          >
            Generate
          </button>
        </div>
      </div>

      <RequestTable columns={columns} data={data} />
    </React.Fragment>
  );
};

export default PrintableCustomerTable;

const RequestTable = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
    },
    usePagination
  );

  return (
    <React.Fragment>
      <table
        className="w-full text-center cursor-default border"
        {...getTableProps()}
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  className="p-4 text-white bg-black border"
                  {...column.getHeaderProps()}
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td className="p-3 border" {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <br />
      <div className="flex gap-2 justify-end">
        <button
          className="px-5 py-1 rounded bg-black text-white hover:bg-gray-900 active:translate-y-1"
          onClick={() => previousPage()}
        >
          Previous
        </button>
        <button
          className="px-5 py-1 rounded bg-black text-white hover:bg-gray-900 active:translate-y-1"
          onClick={() => nextPage()}
        >
          Next
        </button>
      </div>

      <br />
    </React.Fragment>
  );
};
