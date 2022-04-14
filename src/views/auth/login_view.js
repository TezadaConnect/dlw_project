import { useFormik } from "formik";
import React from "react";
import { InputComponent } from "../../components/common/input_components";
import * as Yup from "yup";
import logo from "../../assets/img/logo.png";

const LoginView = () => {
  const loginFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Must be a valid email").required("This field is required"),
      password: Yup.string().required("This field is required"),
    }),
    onSubmit: () => {},
  });
  return (
    <React.Fragment>
      <div className="w-full">
        <div className="w-1/4  mt-20 mx-auto rounded p-5 flex lg:flex-row flex-col justify-between flex-grow">
          <div className="flex flex-grow flex-col">
            <div className="flex justify-center">
              <img src={logo} className="mb-10 w-48 text-center" alt="dlw-logo" />
            </div>
            <InputComponent name="email" label="Email" placeholder="email" formik={loginFormik} />
            <InputComponent name="password" label="Password" placeholder="password" formik={loginFormik} />
            <div className="flex flex-grow justify-end mt-10">
              <button
                className="px-5 py-3 w-full rounded bg-black text-white hover:bg-gray-900 active:translate-y-1"
                onClick={loginFormik.handleSubmit}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default LoginView;
