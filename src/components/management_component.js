import React, { useState } from "react";
import { FaMoneyBill, FaTruckPickup, FaWalking } from "react-icons/fa";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import CreateServiceModal from "./modals/create_service_modal";
import { creationTypeEnum } from "../helpers/constant";

const MySwal = withReactContent(Swal);

export const CARD_DATA = [
  {
    icon: <FaMoneyBill size={150} />,
    label: "TOTAL INCOME",
    value: "2045",
    sub_label: "PHP/MONTH",
    cssStyle: "text-white bg-green-600",
  },
  {
    icon: <FaTruckPickup size={150} />,
    label: "PICKUP REQUESTS",
    value: "205",
    sub_label: "HEAD/MONTH",
    cssStyle: "text-white bg-blue-600",
  },
  {
    icon: <FaWalking size={150} />,
    label: "WALKIN REQUESTS",
    value: "230",
    sub_label: "HEAD/MONTH",
    cssStyle: "text-white bg-red-600",
  },
];

export const DisplayManagementCard = ({ data }) => {
  return (
    <React.Fragment>
      <div>
        <div
          className={`flex flex-row flex-grow p-2 gap-2 border shadow rounded items-center justify-around ${data?.cssStyle}`}
        >
          <div className="object-contain">{data?.icon}</div>
          <div className="text-right">
            <p className="font-bold mb-3 text-xl">{data?.label}</p>
            <p className="font-bold text-4xl">{data?.value}</p>
            <p className="">{data?.sub_label}</p>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

const data = [
  {
    date: "March 1",
    income: 4000,
  },
  {
    date: "March 2",
    income: 3000,
  },
  {
    date: "March 3",
    income: 2000,
  },
  {
    date: "March 4",
    income: 2780,
  },
  {
    date: "March 5",
    income: 1890,
  },
  {
    date: "March 6",
    income: 2390,
  },
  {
    date: "March 7",
    income: 3490,
  },
];

export const GraphDisplay = () => {
  const [date, setDate] = useState(null);
  return (
    <React.Fragment>
      <div className="h-full flex flex-col justify-between">
        <div className="mb-3 text-2xl font-bold flex flex-row justify-between flex-grow">
          <div>MONTHLY INCOME CHART</div>
          <div className="flex flex-row gap-4">
            <div className="text-base">
              <DatePicker
                selected={date}
                onChange={(date) => {
                  setDate(date);
                }}
                className="text-base appearance-none p-3 bg-gray-100 box-border border border-gray-300 rounded focus:outline-none focus:border-gray-600 object-contain"
                dateFormat="MMMM-yyyy"
                showMonthYearPicker
                showFullMonthYearPicker
              />
            </div>
            <button className="px-5 py-3 text-base rounded bg-black text-white hover:bg-gray-900 active:translate-y-1">
              Search
            </button>
          </div>
        </div>
        <div className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart width={150} height={100} data={data}>
              <Tooltip wrapperStyle={{ backgroundColor: "blue" }} />
              <XAxis dataKey="date" />
              <YAxis dataKey="income" />
              <CartesianGrid strokeDasharray="3 3" />
              <Bar dataKey="income" fill="orange" barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </React.Fragment>
  );
};

export const PRODUCT_ITEM = [
  {
    id: "1",
    name: "Wash Service",
    img: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    alt: "wash-service",
  },
  {
    id: "1",
    name: "Dry Service",
    img: "https://images.unsplash.com/photo-1561053720-76cd73ff22c3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    alt: "wash-service",
  },
];

export const ProductServiceCard = ({ item }) => {
  return (
    <React.Fragment>
      <div>
        <div
          className="shadow-md border rounded cursor-pointer transition delay-75 hover:scale-105"
          onClick={() => editServiceModal(item?.id)}
        >
          <div>
            <img src={item.img} alt={item?.alt} className="object-contain" />
          </div>
          <div className=" py-4 font-bold text-2xl text-center">
            {item.name}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

const editServiceModal = ({ id }) => {
  MySwal.fire({
    title: "Wash Only Service",
    color: "black",
    showCloseButton: true,
    confirmButtonText: "Edit Service",
    confirmButtonColor: "green",
    showDenyButton: true,
    denyButtonText: "Delete Service",
    preConfirm: () => {
      Swal.close();
      MySwal.fire({
        width: 700,
        html: <CreateServiceModal type={creationTypeEnum.update} />,
        showConfirmButton: false,
        showCloseButton: true,
      });
    },
    preDeny: () => {
      Swal.close();
      MySwal.fire({
        icon: "success",
        title: "Delete Succesfully",
        text: "Service/Product was deleted permanently from the system",
        timer: 5000,
        confirmButtonColor: "#000",
        focusConfirm: false,
      });
    },
  });
};
