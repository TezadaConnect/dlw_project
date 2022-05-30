import React, { useEffect, useState } from "react";
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
import ProductService from "../services/product_service";
import FinanceService, {
  graphArrayGenerator,
} from "../services/finance_service";
import { useDispatch, useSelector } from "react-redux";
import { setGraphData } from "../redux/slice/service_product_slice";

const MySwal = withReactContent(Swal);

export const CARD_DATA = [
  {
    icon: <FaMoneyBill size={150} />,
    label: "TOTAL INCOME",
    value: 0,
    sub_label: "PHP/MONTH",
    cssStyle: "text-white bg-green-600",
  },
  {
    icon: <FaTruckPickup size={150} />,
    label: "PICKUP REQUESTS",
    value: 1,
    sub_label: "HEAD/MONTH",
    cssStyle: "text-white bg-blue-600",
  },
  {
    icon: <FaWalking size={150} />,
    label: "WALKIN REQUESTS",
    value: 2,
    sub_label: "HEAD/MONTH",
    cssStyle: "text-white bg-red-600",
  },
];

export const DisplayManagementCard = ({ data }) => {
  const [state, setState] = useState(0);
  const { graphData } = useSelector((state) => state.service_product);
  useEffect(() => {
    if (data.value === 0) setState(graphData.totalIncome);
    if (data.value === 1) setState(graphData.pickupCount);
    if (data.value === 2) setState(graphData.walkinCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graphData]);
  return (
    <React.Fragment>
      <div>
        <div
          className={`flex flex-row flex-grow p-2 gap-2 border shadow rounded items-center justify-around ${data?.cssStyle}`}
        >
          <div className="object-contain">{data?.icon}</div>
          <div className="text-right">
            <p className="font-bold mb-3 text-xl">{data?.label}</p>
            <p className="font-bold text-4xl">{state}</p>
            <p className="">{data?.sub_label}</p>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export const GraphDisplay = () => {
  const [date, setDate] = useState(new Date());
  // const [graphData, setGraphData] = useState();
  const { graphData } = useSelector((state) => state.service_product);
  const dispatch = useDispatch();

  const graphSetter = async () => {
    await FinanceService.getAllRequestGenerator()
      .then((res) => {
        dispatch(setGraphData(graphArrayGenerator(res, date)));
      })
      .catch((err) => console.log(err.message));
  };

  useEffect(() => {
    FinanceService.getAllRequestGenerator()
      .then((res) => {
        dispatch(setGraphData(graphArrayGenerator(res, date)));
      })
      .catch((err) => console.log(err.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                // value={new Date.now()}
              />
            </div>
            <button
              onClick={() => {
                graphSetter();
              }}
              className="px-5 py-3 text-base rounded bg-black text-white hover:bg-gray-900 active:translate-y-1"
            >
              Search
            </button>
          </div>
        </div>
        <div className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart width={150} height={100} data={graphData?.DATELIST}>
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

export const ProductServiceCard = ({ item }) => {
  const { user } = useSelector((state) => state.user);
  return (
    <React.Fragment>
      <div
        onClick={() =>
          editServiceModal(item?.id, item?.data?.img_path, user?.id)
        }
      >
        <div className="shadow-md border rounded cursor-pointer transition delay-75 hover:scale-105">
          <div>
            <img
              src={item?.data?.img_url}
              alt={item?.data?.alt_url}
              className="object-contain"
            />
          </div>
          <div className=" py-4 font-bold text-2xl text-center">
            {item?.data?.service_name}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

const editServiceModal = (id, path, moderator) => {
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
        html: (
          <CreateServiceModal
            prod_id={id}
            type={creationTypeEnum.update}
            moderator={moderator}
          />
        ),
        showConfirmButton: false,
        showCloseButton: true,
      });
    },
    preDeny: () => {
      Swal.close();
      ProductService.deleteProduct(id, path, moderator);
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
