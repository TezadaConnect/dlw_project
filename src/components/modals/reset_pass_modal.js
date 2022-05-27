import { useFormik } from "formik";
import React, { useState } from "react";
import { InputComponent } from "../common/input_component";
import * as Yup from "yup";
import { roleSelect } from "../../helpers/constant";
import ReactLoading from "react-loading";
import axios from "axios";
import { API_HOST } from "../../config/api_config";
import { errorPopup, successPopup } from "../common/response_component";

const validationStandard = Yup.string().required("This field is required");
const validationCpassword = Yup.string()
  .required("This field is required")
  .oneOf([Yup.ref("password"), null], "Passwords must match");

const ResetPasswordModal = ({ value, moderator }) => {
  const [loading, setBusy] = useState(false);
  const requestForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      userId: value?.id ?? "",
      password: "",
      moderator: moderator,
      c_password: "",
    },
    validationSchema: Yup.object({
      password: validationStandard,
      c_password: validationCpassword,
    }),
    onSubmit: async (values) => {
      setBusy(true);
      await axios
        .post(API_HOST + "reset-password", values, { withCredentials: true })
        .then(() => {
          successPopup("Password Reset");
        })
        .catch((err) => {
          errorPopup(err.message);
        });
    },
  });

  if (loading) {
    return (
      <React.Fragment>
        <div className="mx-auto my-5 flex justify-center items-center">
          <ReactLoading
            type={"spinningBubbles"}
            color={"black"}
            height={50}
            width={50}
          />
        </div>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <div className="flex flex-col w-full">
        <h1 className="text-left my-5 font-bold text-3xl text-black">
          Change password
        </h1>
        <p className="text-2xl font-bold text-black my-10">{value?.email}</p>

        <InputComponent
          name="password"
          label="Password"
          placeholder="password"
          type="password"
          formik={requestForm}
        />
        <InputComponent
          list={roleSelect}
          name="c_password"
          label="Re-type Password"
          placeholder="re-type password"
          type="password"
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

export default ResetPasswordModal;
