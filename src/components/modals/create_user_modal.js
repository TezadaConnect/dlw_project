import { useFormik } from "formik";
import React, { useState } from "react";
import { InputComponent, SelectComponent } from "../common/input_component";
import * as Yup from "yup";
import { creationTypeEnum, roleSelect } from "../../helpers/constant";
import axios from "axios";
import { API_HOST } from "../../config/api_config";
import ReactLoading from "react-loading";
import { errorPopup, successPopup } from "../common/response_component";

const validationStandard = Yup.string().required("This field is required");
const validationCpassword = Yup.string()
  .required("This field is required")
  .oneOf([Yup.ref("password"), null], "Passwords must match");

const CreateUserModal = ({ type = creationTypeEnum.new, user = null }) => {
  const [loading, setBusy] = useState(false);

  const requestForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: user?.email ?? "",
      role: user?.role ?? "",
      fname: user?.fname ?? "",
      lname: user?.lname ?? "",
      userId: user?.id ?? "",
      password: "",
      c_password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Must be a valid email")
        .required("This field is required"),
      role: validationStandard,
      fname: validationStandard,
      lname: validationStandard,
      password:
        type !== creationTypeEnum.update ? validationStandard : Yup.string(),
      c_password:
        type !== creationTypeEnum.update ? validationCpassword : Yup.string(),
    }),
    onSubmit: async (values) => {
      setBusy(true);
      if (type === creationTypeEnum.new) {
        return await axios
          .post(API_HOST + "add-user", values, {
            withCredentials: true,
          })
          .then(() => successPopup("Created New Account"))
          .catch((err) => errorPopup(err.message));
      }
      await axios
        .post(API_HOST + "update-user", values, {
          withCredentials: true,
        })
        .then(() => successPopup("Updateded Successfully"))
        .catch((err) => errorPopup(err.message));
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
          {type === creationTypeEnum.new
            ? "Create a New Account"
            : "Edit Profile"}
        </h1>

        <InputComponent
          name="email"
          label="Email"
          placeholder="email"
          formik={requestForm}
        />

        <SelectComponent
          list={roleSelect}
          name="role"
          label="Role"
          placeholder="Select Role"
          formik={requestForm}
        />

        <InputComponent
          name="fname"
          label="First Name"
          placeholder="first name"
          formik={requestForm}
        />

        <InputComponent
          name="lname"
          label="Last Name"
          placeholder="last name"
          formik={requestForm}
        />

        {type !== creationTypeEnum.update && (
          <InputComponent
            name="password"
            label="Password"
            placeholder="password"
            type="password"
            formik={requestForm}
          />
        )}

        {type !== creationTypeEnum.update && (
          <InputComponent
            name="c_password"
            label="Confirm Password"
            placeholder="confirm password"
            type="password"
            formik={requestForm}
          />
        )}

        <button
          onClick={requestForm.handleSubmit}
          className="my-5 px-5 py-3 w-full rounded bg-black text-white hover:bg-gray-900 active:translate-y-1"
        >
          Create New User
        </button>
      </div>
    </React.Fragment>
  );
};

export default CreateUserModal;
