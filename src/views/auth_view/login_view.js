import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { InputComponent } from "../../components/common/input_component";
import * as Yup from "yup";
import ReactLoading from "react-loading";
import useAuthHook from "../../helpers/hooks/useAuthHook";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AppSettingService from "../../services/app_setting_services";

const LoginView = () => {
  const { login } = useAuthHook();
  const { user } = useSelector((state) => state.user);
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  const loginFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Must be a valid email")
        .required("This field is required"),
      password: Yup.string().required("This field is required"),
    }),
    onSubmit: (values) => {
      login(values);
    },
  });

  useEffect(() => {
    AppSettingService.getAppSettingsInfo().then((res) => {
      setData(res);
    });
    if (user !== null) {
      navigate("/home", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <React.Fragment>
      <div className="w-full">
        <div className="w-1/4  mt-20 mx-auto rounded p-5 flex lg:flex-row flex-col justify-between flex-grow">
          <div className="flex flex-grow flex-col">
            <div className="flex justify-center">
              {data === null ? (
                <div className="mx-auto my-5 flex justify-center items-center">
                  <ReactLoading
                    type={"spinningBubbles"}
                    color={"black"}
                    height={50}
                    width={50}
                  />{" "}
                </div>
              ) : (
                <img
                  src={data?.img_url}
                  className="mb-10 w-48 text-center"
                  alt="dlw-logo"
                />
              )}
            </div>
            <InputComponent
              name="email"
              label="Email"
              placeholder="email"
              formik={loginFormik}
            />
            <InputComponent
              type="password"
              name="password"
              label="Password"
              placeholder="password"
              formik={loginFormik}
            />
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
