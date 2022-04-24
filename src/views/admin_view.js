import React, { useMemo } from "react";
import { MdAccountCircle } from "react-icons/md";
import { useTable } from "react-table/dist/react-table.development";
import NavbarComponent from "../components/common/navbar_component";
import SidebarComponent from "../components/common/sidebar_component";
import { BsPencilFill } from "react-icons/bs";
import { FaKey, FaTrash } from "react-icons/fa";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import UpdateUserModal from "../components/modals/update_user_modal";
import CreateUserModal from "../components/modals/create_user_modal";

const MySwal = withReactContent(Swal);

const sidebarItems = [
  {
    label: "Accounts",
    value: 1,
    icon: <MdAccountCircle size={20} />,
  },
];

const AdminView = () => {
  return (
    <React.Fragment>
      <div className="flex flex-row">
        <div className="h-screen">
          <SidebarComponent item={sidebarItems} />
        </div>
        <div className="flex-grow">
          <NavbarComponent title="ADMINISTRATOR" />
          <div className="object-contain flex flex-row justify-between items-center mx-5 mt-4">
            <p className="text-xl text-gray-500 font-bold">ALL ACCOUNTS</p>
            <button
              onClick={() => createAccountModal()}
              className="px-5 py-3 rounded bg-black text-white hover:bg-gray-900 active:translate-y-1"
            >
              Create New Account
            </button>
          </div>
          <div className="mt-3 mx-5">
            <div>
              <TableView />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default AdminView;

const TableView = () => {
  const ITEMS = [
    {
      id: "1",
      email: "tezada@gmail.com",
      fname: "Terrence",
      lname: "Calzada",
      role: "admin",
    },
    {
      id: "2",
      email: "tezada@gmail.com",
      fname: "Terrence",
      lname: "Calzada",
      role: "admin",
    },
  ];

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "First Name",
        accessor: "fname",
      },
      {
        Header: "Last Name",
        accessor: "lname",
      },
      {
        Header: "Role",
        accessor: "role",
      },
      {
        Header: "Action",
        accessor: "action",
        Cell: ({ cell }) => (
          <React.Fragment>
            <div className="flex flex-row gap-4 justify-center items-center">
              <div className="active:translate-y-1 transition delay-75 hover:text-red-600">
                <BsPencilFill
                  size={20}
                  onClick={() => {
                    editAccountModal(cell.row.values.id);
                  }}
                />
              </div>
              <div className="active:translate-y-1 transition delay-75 hover:text-red-600">
                <FaTrash
                  size={20}
                  onClick={() => {
                    deleteAccountPopup(cell.row.values.id);
                  }}
                />
              </div>
              <div className="active:translate-y-1 transition delay-75 hover:text-red-600">
                <FaKey
                  size={20}
                  onClick={() => {
                    changePasswordPopup(cell.row.values.id);
                  }}
                />
              </div>
            </div>
          </React.Fragment>
        ),
      },
    ],
    []
  );

  const data = useMemo(() => ITEMS, []);

  return (
    <React.Fragment>
      <AccountsTable columns={columns} data={data} />
    </React.Fragment>
  );
};

const AccountsTable = ({ columns, data }) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  return (
    <table
      className="w-full text-center cursor-default border"
      {...getTableProps()}
    >
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th className="p-2 border" {...column.getHeaderProps()}>
                {column.render("Header")}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return (
                  <td className="px-2 py-1 border" {...cell.getCellProps()}>
                    {cell.render("Cell")}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const editAccountModal = ({ id }) => {
  MySwal.fire({
    html: <UpdateUserModal id={id} />,
    width: 700,
    showConfirmButton: false,
    showCloseButton: true,
  });
};

const createAccountModal = () => {
  MySwal.fire({
    html: <CreateUserModal />,
    width: 700,
    showConfirmButton: false,
    showCloseButton: true,
  });
};

const deleteAccountPopup = ({ id }) => {
  MySwal.fire({
    icon: "success",
    title: "Delete Succesfully",
    text: "Account was deleted permanently from the system",
    timer: 5000,
    confirmButtonColor: "#000",
    focusConfirm: false,
  });
};

const changePasswordPopup = ({ id }) => {
  MySwal.fire({
    icon: "success",
    title: "Email Sent",
    text: "Login to your email account and change your password",
    timer: 5000,
    confirmButtonColor: "#000",
    focusConfirm: false,
  });
};
