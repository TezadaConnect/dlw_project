import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { usePagination, useTable } from "react-table";
import RequestService from "../../services/request_service";

const LatestCustomerTable = () => {
  const [client, setClient] = useState([]);
  const { products } = useSelector((state) => state.service_product);

  const convertProducts = (id) => {
    let itemArr = {};
    products?.forEach((element) => {
      itemArr = { ...itemArr, [element?.id]: element.data.service_name };
    });
    console.log(itemArr);
    return itemArr[id];
  };

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Customer Name",
        accessor: "customer_name",
      },
      {
        Header: "Contact No.",
        accessor: "contact",
      },
      {
        Header: "Service",
        accessor: "service_type",
        Cell: ({ cell }) => (
          <React.Fragment>
            {convertProducts(cell?.row?.values?.service_type)}
          </React.Fragment>
        ),
      },
      {
        Header: "Request Type",
        accessor: "request_type",
      },
      {
        Header: "Amount",
        accessor: "price",
      },
      {
        Header: "Date",
        accessor: "recieve_date",
        Cell: ({ cell }) => {
          const dateForDisplay = new Date(
            cell?.row?.values?.recieve_date
          ).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          });
          return <React.Fragment>{dateForDisplay}</React.Fragment>;
        },
      },
    ],
    []
  );

  const data = useMemo(
    () => client, // eslint-disable-next-line react-hooks/exhaustive-deps
    [client]
  );

  useEffect(() => {
    RequestService.GetAllMergeRequest()
      .then((res) => {
        setClient(res);
      })
      .catch((err) => console.log(err.message));
  }, []);

  return (
    <React.Fragment>
      <RequestTable columns={columns} data={data} />
    </React.Fragment>
  );
};

export default LatestCustomerTable;

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
