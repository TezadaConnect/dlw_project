import React, { useEffect, useMemo, useState } from "react";
import { usePagination, useTable } from "react-table";
import FinanceService, {
  arrayOfDateGenerator,
} from "../../services/finance_service";
import DatePicker from "react-datepicker";
import { errorPopup } from "../common/response_component";
import selectedDateReport from "../pdfs/selected_date_report";

const PrintableCustomerTable = () => {
  const [client, setClient] = useState([]);

  const columns = useMemo(
    () => [
      {
        Header: "Date",
        accessor: "date",
      },
      {
        Header: "Total Request",
        accessor: "totalRequestCount",
      },
      {
        Header: "Number of Pickup",
        accessor: "pickUpCount",
      },
      {
        Header: "Number of Walkin.",
        accessor: "WalkInCount",
      },
      {
        Header: "Income",
        accessor: "incomeCount",
      },
    ],
    []
  );

  const [displayData, setDisplayData] = useState([]);
  const data = useMemo(
    () => displayData, // eslint-disable-next-line react-hooks/exhaustive-deps
    [displayData]
  );

  const dateObserver = new Date();
  const [datePick, setDatePick] = useState({
    from: new Date(dateObserver.getFullYear(), dateObserver.getMonth(), 1),
    to: new Date(dateObserver.getFullYear(), dateObserver.getMonth() + 1, 0),
  });

  const searchForData = () => {
    if (new Date(datePick.from) > new Date(datePick.to)) {
      return errorPopup("Date To must be later than Date From");
    }
    setDisplayData(arrayOfDateGenerator(client, datePick.from, datePick.to));
  };

  useEffect(() => {
    FinanceService.getAllRequestGenerator()
      .then((res) => {
        setClient(res);
        setDisplayData(arrayOfDateGenerator(res, datePick.from, datePick.to));
      })
      .catch((err) => console.log(err.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      <div className="mb-5 flex flex-row justify-between items-center">
        <div className="font-bold text-2xl">REPORT SECTION</div>
        <div className="flex flex-row gap-2">
          <div className="text-base">
            <DatePicker
              selected={datePick.from}
              placeholderText="From"
              onChange={(date) => setDatePick({ ...datePick, from: date })}
              className="text-base appearance-none p-3 bg-gray-100 box-border border border-gray-300 rounded focus:outline-none focus:border-gray-600 object-contain"
            />
          </div>
          <div className="text-base">
            <DatePicker
              selected={datePick.to}
              placeholderText="To"
              onChange={(date) => setDatePick({ ...datePick, to: date })}
              className="text-base appearance-none p-3 bg-gray-100 box-border border border-gray-300 rounded focus:outline-none focus:border-gray-600 object-contain"
            />
          </div>
          <button
            className="px-5 py-3 rounded bg-black text-white hover:bg-gray-900 active:translate-y-1"
            onClick={() => searchForData()}
          >
            Search
          </button>

          <button
            className="px-5 py-3 rounded bg-black text-white hover:bg-gray-900 active:translate-y-1"
            onClick={() =>
              window.open(selectedDateReport(displayData, datePick), "_blank")
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
