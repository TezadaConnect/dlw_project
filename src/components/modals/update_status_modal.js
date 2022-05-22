import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { SelectComponent } from "../common/input_component";
import * as Yup from "yup";
import RequestService from "../../services/request_service";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import axios from "axios";

const REQUESTS_TYPE = {
  walkin: [
    { value: "WAITING", label: "WAITING" },
    { value: "WASH", label: "WASH" },
    { value: "HANDWASH", label: "HANDWASH" },
    { value: "DRY", label: "DRY" },
    { value: "IRON", label: "IRON" },
    { value: "FOLD", label: "FOLD" },
    { value: "RELEASE", label: "RELEASE" },
    { value: "DONE", label: "DONE" },
  ],
  pickup: [
    { value: "WAITING", label: "WAITING" },
    { value: "PICKUP", label: "PICKUP" },
    { value: "REJECT", label: "REJECT" },
    { value: "WASH", label: "WASH" },
    { value: "HANDWASH", label: "HANDWASH" },
    { value: "DRY", label: "DRY" },
    { value: "IRON", label: "IRON" },
    { value: "FOLD", label: "FOLD" },
    { value: "DELIVERY", label: "DELIVERY" },
    { value: "DONE", label: "DONE" },
  ],
};

const messageArrHolder = [
  {
    title: "YOUR ITEM IS ACCEPTED",
    message: "Hi your item was accepted please wait for the pickup",
  },
  {
    title: "YOUR ITEM IS REJECTED",
    message: "Sorry we can't cater your item request, try again later!",
  },
  {
    title: "YOUR ITEM IS NOW IN THE CLEANING PROCESS",
    message:
      "Hello there! Please be patient while we are doing the Cleaning process",
  },
  {
    title: "YOUR ITEM IS OUT FOR DELIVER",
    message: "Are you still there? Your item will be there soon!",
  },
  {
    title: "YOUR ITEM IS DELIVERED",
    message: "Hi the item is right outside waiting for you!",
  },
];

const getMessage = (status) => {
  if (status === REQUESTS_TYPE.pickup[0].value) return null;
  if (status === REQUESTS_TYPE.pickup[4].value) return null;
  if (status === REQUESTS_TYPE.pickup[5].value) return null;
  if (status === REQUESTS_TYPE.pickup[6].value) return null;
  if (status === REQUESTS_TYPE.pickup[7].value) return null;

  if (status === REQUESTS_TYPE.pickup[1].value) return messageArrHolder[0];
  if (status === REQUESTS_TYPE.pickup[2].value) return messageArrHolder[1];
  if (status === REQUESTS_TYPE.pickup[8].value) return messageArrHolder[3];
  if (status === REQUESTS_TYPE.pickup[9].value) return messageArrHolder[4];

  return messageArrHolder[2];
};

const UpdateStatusModal = ({
  user_id,
  id,
  value,
  is_walk = true,
  isAdmin = false,
}) => {
  const list = is_walk ? REQUESTS_TYPE.walkin : REQUESTS_TYPE.pickup;
  const requestForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      status: "",
    },
    validationSchema: Yup.object({
      status: Yup.string().required("This field is required"),
    }),
    onSubmit: async (value) => {
      await RequestService.requestStatusModify(id, value.status, is_walk)
        .then(() => Swal.clickConfirm())
        .catch((err) => {
          console.log(err.message);
          Swal.clickDeny();
        });

      if (is_walk === false) {
        const messageToSend = getMessage(value.status);

        if (messageToSend !== null) {
          await axios
            .post("https://app.nativenotify.com/api/indie/notification", {
              subID: user_id,
              appId: 2746,
              appToken: "33W2w1mWUguk3y6DPPFDWL",
              title: messageToSend?.title,
              message: messageToSend?.message,
            })
            .catch((err) => console.log(err.message));
        }
      }
    },
  });

  const [userList, setUserList] = useState([]);
  const userNote = () => {
    let arrayHolder = [...list];
    const index = arrayHolder.findIndex((item) => {
      if (item.value === value) {
        return true;
      }

      return null;
    });

    console.log(index);
    if (index > -1) {
      arrayHolder.splice(0, index);
    }
    console.log(arrayHolder);
    setUserList(arrayHolder);
  };

  useEffect(() => {
    userNote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return (
    <React.Fragment>
      <div className="flex flex-col w-full">
        <h1 className="text-left my-5 font-bold text-3xl text-black">
          Update Status Note
        </h1>
        <SelectComponent
          list={isAdmin ? list : userList}
          name="status"
          label="Status Note"
          placeholder="Select Role"
          formik={requestForm}
        />
        <button
          onClick={requestForm.handleSubmit}
          className="my-5 px-5 py-3 w-full rounded bg-black text-white hover:bg-gray-900 active:translate-y-1"
        >
          Save Changes
        </button>
      </div>
    </React.Fragment>
  );
};

export default UpdateStatusModal;
