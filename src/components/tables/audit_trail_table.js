import React, { useEffect, useMemo, useState } from "react";
import { usePagination, useTable } from "react-table";
import AuditTrailService from "../../services/audit_trail_service";

const AuditTrailView = () => {
  const [record, setRecord] = useState([]);

  const columns = useMemo(
    () => [
      {
        Header: "User",
        accessor: "user",
      },
      {
        Header: "ACTION",
        accessor: "action",
      },
      {
        Header: "Description",
        accessor: "description",
      },
      {
        Header: "Date",
        accessor: "date",
      },
    ],
    []
  );

  const data = useMemo(
    () => record, // eslint-disable-next-line react-hooks/exhaustive-deps
    [record]
  );

  useEffect(() => {
    AuditTrailService.readAllRecord()
      .then((res) => setRecord(res))
      .catch((err) => console.log(err.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      <div className="m-4">
        <p className="text-xl mb-3 text-gray-500 font-bold">AUDIT TRAIL</p>
        <AuditTrailTable columns={columns} data={data} />
      </div>
    </React.Fragment>
  );
};

export default AuditTrailView;

const AuditTrailTable = ({ columns, data }) => {
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
