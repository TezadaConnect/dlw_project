import { useFormik } from "formik";
import React from "react";
import Swal from "sweetalert2";
import { InputComponent, SelectComponent } from "../common/input_component";
import * as Yup from "yup";
import { roleSelect } from "../../helpers/constant";

const validationStandard = Yup.string().required("This field is required");
const validationNumber = Yup.number()
  .typeError("Must be a number")
  .required("This field is required");

const UpdateUserModal = () => {
  const requestForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: "",
      role: "",
      fname: "",
      lname: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Must be a valid email")
        .required("This field is required"),
      role: validationStandard,
      fname: validationStandard,
      lname: validationNumber,
    }),
    onSubmit: (values) => {
      Swal.close();
    },
  });

  return (
    <React.Fragment>
      <div className="flex flex-col w-full">
        <h1 className="text-left my-5 font-bold text-3xl text-black">
          Create a New Account
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

export default UpdateUserModal;
