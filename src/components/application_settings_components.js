import { useFormik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import useImageHook from "../helpers/hooks/useImageHook";
import AppSettingService from "../services/app_setting_services";
import { InputComponent } from "./common/input_component";
import ReactLoading from "react-loading";
import { errorPopup, successPopup } from "./common/response_component";

export const ChangeImageModal = ({ link_image = "", img_path, moderator }) => {
  const [image, setImage] = useImageHook();
  const [loading, setBusy] = useState(false);

  const requestForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      img: "",
      img_path: img_path ?? "",
      moderator: moderator,
    },
    validationSchema: Yup.object({
      img: Yup.mixed().required("This Field is Required"),
    }),
    onSubmit: async (values) => {
      setBusy(true);
      AppSettingService.updateProfileImage(values, image.value)
        .then(() => successPopup("Updated Successfully"))
        .then((err) => errorPopup(err.message));
    },
  });

  const imageValidation =
    requestForm.touched.img && requestForm.errors.img
      ? "bg-red-600 hover:bg-red-700 hover:text-white text-white"
      : "bg-white hover:bg-green-600 hover:text-white text-green-600";

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
      <h1 className="text-left my-5 font-bold text-3xl text-black">
        Change Image
      </h1>

      {image.url !== null && (
        <div className="mx-auto mb-4">
          <img src={image.url} alt={image.alt} />
        </div>
      )}

      {image.value === null && (
        <div className="mx-auto mb-4">
          {link_image !== "" && <img src={link_image} alt="project-img" />}
        </div>
      )}

      <div className="w-full my-5">
        <label
          className={
            "w-full flex flex-col rounded items-center py-3 tracking-wide uppercase border cursor-pointer ease-linear transition-all duration-150 " +
            imageValidation
          }
        >
          <span className="text-base leading-normal">Upload a Image</span>
          <input
            name="img"
            type="file"
            accept="image/png, image/jpeg"
            className="hidden"
            onChange={(e) => {
              requestForm.handleChange(e);
              setImage(e);
            }}
          />
        </label>
      </div>

      <button
        onClick={requestForm.handleSubmit}
        className="my-5 px-5 py-3 w-full rounded bg-black text-white hover:bg-gray-900 active:translate-y-1"
      >
        Save Changes
      </button>
    </React.Fragment>
  );
};

export const ChangeValueModal = ({ label, name, init, moderator }) => {
  const [loading, setBusy] = useState(false);
  const sendForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      [name]: init ?? "",
    },
    validationSchema: Yup.object({
      [name]: Yup.string().required("This Field is Required"),
    }),
    onSubmit: (value) => {
      setBusy(true);
      AppSettingService.updateValue(value, moderator)
        .then(() => successPopup("Updated Successfully"))
        .then((err) => errorPopup(err.message));
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
      <h1 className="text-left my-5 font-bold text-3xl text-black">
        Change {label}
      </h1>

      <InputComponent
        label={label}
        name={name}
        formik={sendForm}
        placeholder={label}
      />

      <button
        onClick={sendForm.handleSubmit}
        className="my-5 px-5 py-3 w-full rounded bg-black text-white hover:bg-gray-900 active:translate-y-1"
      >
        Save Changes
      </button>
    </React.Fragment>
  );
};
