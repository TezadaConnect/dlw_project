import React, { useEffect, useMemo, useState } from "react";
import { MdAccountCircle, MdSettingsApplications } from "react-icons/md";
import { useTable } from "react-table/dist/react-table.development";
import NavbarComponent from "../components/common/navbar_component";
import SidebarComponent from "../components/common/sidebar_component";
import { BsPencilFill } from "react-icons/bs";
import { FaKey, FaTrash } from "react-icons/fa";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import CreateUserModal from "../components/modals/create_user_modal";
import { query, onSnapshot } from "@firebase/firestore";
import { USERS_QUERY } from "../services/auth_service";
import axios from "axios";
import { API_HOST } from "../config/api_config";
import { creationTypeEnum } from "../helpers/constant";
import ResetPasswordModal from "../components/modals/reset_pass_modal";
import {
  ChangeImageModal,
  ChangeValueModal,
} from "../components/application_settings_components";
import { useDispatch, useSelector } from "react-redux";
import { setRefresh } from "../redux/slice/response_slice";

const MySwal = withReactContent(Swal);

const sidebarItems = [
  {
    label: "Accounts",
    value: 1,
    icon: <MdAccountCircle size={20} />,
  },
  {
    label: "App Setting",
    value: 2,
    icon: <MdSettingsApplications size={20} />,
  },
];

const AdminView = () => {
  const [page, setPage] = useState(1);
  return (
    <React.Fragment>
      <div className="flex flex-row">
        <div className="h-screen">
          <SidebarComponent item={sidebarItems} setItem={setPage} />
        </div>
        <div className="flex-grow">
          <NavbarComponent title="ADMINISTRATOR" />
          {page === 1 && <AccountsView />}
          {page === 2 && <ApplicationSetting />}
        </div>
      </div>
    </React.Fragment>
  );
};

export default AdminView;

const AccountsView = () => {
  return (
    <React.Fragment>
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
    </React.Fragment>
  );
};

const TableView = () => {
  const [accounts, setAccounts] = useState([]);

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
                    createAccountModal(
                      creationTypeEnum.update,
                      cell.row.values
                    );
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
                    updatePassword(cell.row.values);
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

  const data = useMemo(
    () => accounts, // eslint-disable-next-line react-hooks/exhaustive-deps
    [accounts]
  );

  useEffect(() => {
    const unSub = onSnapshot(query(USERS_QUERY), (snap) => {
      const collection = [];
      snap.forEach((doc) => {
        collection.push({ id: doc.id, ...doc.data() });
      });
      setAccounts(collection);
    });

    return unSub;
  }, []);

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

const createAccountModal = (creation, user) => {
  MySwal.fire({
    html: <CreateUserModal type={creation} user={user} />,
    width: 700,
    showConfirmButton: false,
    showCloseButton: true,
  });
};

const deleteAccountPopup = (id) => {
  MySwal.fire({
    icon: "success",
    title: "Delete Succesfully",
    text: "Account was deleted permanently from the system",
    confirmButtonColor: "#000",
    focusConfirm: false,
    preConfirm: async () => {
      console.log(id);
      await axios.post(
        API_HOST + "delete-user",
        { userId: id },
        { withCredentials: true }
      );
    },
  });
};

const updatePassword = (value) => {
  MySwal.fire({
    html: <ResetPasswordModal value={value} />,
    width: 700,
    showConfirmButton: false,
    showCloseButton: true,
  });
};

const ApplicationSetting = () => {
  const { project } = useSelector((state) => state.response);
  const dispatch = useDispatch();
  return (
    <React.Fragment>
      <div className="w-1/3 m-auto flex flex-col items-start mt-14">
        <div className="flex flex-col items-center w-full mb-14">
          <div className="rounded-full h-48 w-48 relative cursor-pointer">
            {project?.img_url === "" ? (
              <div className="absolute top-0 flex items-center justify-center  h-48 w-48 bg-black text-white rounded-full">
                Change Profile
              </div>
            ) : (
              <img
                src={project?.img_url}
                alt="This is application Logo"
                className="rounded-full h-48 w-48"
              />
            )}

            <div
              onClick={() =>
                editImageComponent(project?.img_path, project?.img_url)
              }
              className="opacity-0 absolute top-0 flex items-center justify-center  transition delay-75 hover:opacity-75 h-48 w-48 bg-black text-white rounded-full"
            >
              Change Profile
            </div>
          </div>
        </div>

        <div className="w-full flex flex-row justify-between mb-5">
          <div className="flex flex-row gap-3">
            <div className="font-semibold text-gray-600">App name: </div>
            <div className="font-bold">{project?.app_name}</div>
          </div>
          <div>
            <BsPencilFill
              onClick={async () => {
                await editValueComponent(
                  "app_name",
                  "Application name",
                  project?.app_name
                );
                dispatch(setRefresh());
              }}
              className="hover:text-green-700"
            />
          </div>
        </div>

        <div className="w-full flex flex-row justify-between mb-5">
          <div className="flex flex-row gap-3">
            <div className="font-semibold text-gray-600">Company: </div>
            <div className="font-bold">{project?.company_name}</div>
          </div>
          <div>
            <BsPencilFill
              onClick={() =>
                editValueComponent(
                  "company_name",
                  "Company",
                  project?.company_name
                )
              }
              className="hover:text-green-700"
            />
          </div>
        </div>

        <div className="w-full flex flex-row justify-between mb-5">
          <div className="flex flex-row gap-3">
            <div className="font-semibold text-gray-600">Version: </div>
            <div className="font-bold">{project?.version}</div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

const editImageComponent = (path, link) => {
  MySwal.fire({
    width: 700,
    html: <ChangeImageModal img_path={path} link_image={link} />,
    showConfirmButton: false,
    showCloseButton: true,
  });
};

const editValueComponent = (name, label, init) => {
  return MySwal.fire({
    width: 700,
    html: <ChangeValueModal name={name} label={label} init={init} />,
    showConfirmButton: false,
    showCloseButton: true,
  });
};
