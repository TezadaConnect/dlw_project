import { useFormik } from "formik";
import React, { useEffect } from "react";
import Swal from "sweetalert2";
import {
  InputComponent,
  SelectComponent,
  TextAreaComponent,
} from "../common/input_component";
import * as Yup from "yup";
import { creationTypeEnum } from "../../helpers/constant";

const validationStandard = Yup.string().required("This field is required");
const validationNumber = Yup.number()
  .typeError("Must be a number")
  .required("This field is required");

const listItem = [
  { label: "Mobile", value: "mobile" },
  { label: "Web", value: "web" },
];

const CreateServiceModal = ({
  type = creationTypeEnum.new,
  title,
  buttonText,
}) => {
  const requestForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      service_name: "",
      platform: "",
      rate: "",
      desc: "",
    },
    validationSchema: Yup.object({
      service_name: validationStandard,
      platform: validationStandard,
      rate: validationStandard,
      desc: validationNumber,
    }),
    onSubmit: (values) => {
      Swal.close();
    },
  });

  const onOpenModal = () => {};

  useEffect(() => {
    onOpenModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  return (
    <React.Fragment>
      <div className="flex flex-col w-full">
        <h1 className="text-left my-5 font-bold text-3xl text-black">
          {type === creationTypeEnum.new
            ? "Create a New Service"
            : "Edit Product/Service"}
        </h1>

        <InputComponent
          name="service_name"
          label="Service Name"
          placeholder="service name"
          formik={requestForm}
        />

        <SelectComponent
          list={listItem}
          name="platform"
          label="Platform"
          placeholder="Select Platform"
          formik={requestForm}
        />

        <InputComponent
          name="rate"
          label="Rate"
          placeholder="rate"
          formik={requestForm}
        />

        <TextAreaComponent
          name="desc"
          label="Description"
          placeholder="description"
          formik={requestForm}
        />

        <button
          onClick={requestForm.handleSubmit}
          className="my-5 px-5 py-3 w-full rounded bg-black text-white hover:bg-gray-900 active:translate-y-1"
        >
          {type === creationTypeEnum.new
            ? "Create new Service"
            : "Save Changes"}
        </button>
      </div>
    </React.Fragment>
  );
};

export default CreateServiceModal;
