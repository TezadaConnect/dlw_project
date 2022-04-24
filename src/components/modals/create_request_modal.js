import { useFormik } from "formik";
import React from "react";
import Swal from "sweetalert2";
import { InputComponent, SelectComponent } from "../common/input_component";
import * as Yup from "yup";

const validationStandard = Yup.string().required("This field is required");
const validationNumber = Yup.number()
  .typeError("Must be a number")
  .required("This field is required");

const CreateRequestModal = () => {
  const requestForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      customer_name: "",
      service_type: "",
      address: "",
      contact: "",
      kilogram: "",
      price: "",
    },
    validationSchema: Yup.object({
      customer_name: validationStandard,
      service_type: validationStandard,
      address: validationStandard,
      contact: validationNumber,
      kilogram: validationNumber,
      price: validationNumber,
    }),
    onSubmit: (values) => {
      Swal.close();
    },
  });

  return (
    <React.Fragment>
      <div className="flex flex-col w-full">
        <h1 className="text-left my-5 font-bold text-3xl text-black">
          Add New Request Form
        </h1>

        <InputComponent
          name="customer_name"
          label="Customer Name"
          placeholder="customer"
          formik={requestForm}
        />

        <SelectComponent
          name="service_type"
          label="Service Type"
          placeholder="Select Service Type"
          formik={requestForm}
        />

        <InputComponent
          name="address"
          label="Address"
          placeholder="customer address"
          formik={requestForm}
        />

        <InputComponent
          name="contact"
          label="Contact No."
          placeholder="customer contact np."
          formik={requestForm}
        />

        <InputComponent
          name="kilogram"
          label="Kilogram"
          placeholder="kilogram"
          formik={requestForm}
        />

        <InputComponent
          name="price"
          label="Price"
          placeholder="price"
          formik={requestForm}
        />

        <button
          onClick={requestForm.handleSubmit}
          className="my-5 px-5 py-3 w-full rounded bg-black text-white hover:bg-gray-900 active:translate-y-1"
        >
          Add Request
        </button>
      </div>
    </React.Fragment>
  );
};

export default CreateRequestModal;
