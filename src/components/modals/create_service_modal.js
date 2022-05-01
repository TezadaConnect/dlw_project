import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import {
  InputComponent,
  SelectComponent,
  TextAreaComponent,
} from "../common/input_component";
import * as Yup from "yup";
import { creationTypeEnum } from "../../helpers/constant";
import { MdAddCircleOutline } from "react-icons/md";
import { HiOutlineMinusCircle } from "react-icons/hi";
import ProductService from "../../services/product_service";
import { errorPopup, successPopup } from "../common/response_component";
import useImageHook from "../../helpers/hooks/useImageHook";
import ReactLoading from "react-loading";

const validationStandard = Yup.string().required("This field is required");

const listItem = [
  { label: "Mobile", value: "mobile" },
  { label: "Web", value: "web" },
];

const CreateServiceModal = ({ type = creationTypeEnum.new, prod_id }) => {
  const [image, setImage] = useImageHook();
  const [editData, setEditData] = useState();
  const [loading, setBusy] = useState(false);

  const requestForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      service_name: editData?.service_name ?? "",
      platform: editData?.platform ?? "",
      rate: editData?.rate ?? "",
      desc: editData?.desc ?? "",
      img: editData?.img_url ?? "",
      img_path: editData?.img_path ?? "",
    },
    validationSchema: Yup.object({
      service_name: validationStandard,
      platform: validationStandard,
      rate: Yup.array().required("This field is required"),
      desc: validationStandard,
      img: Yup.mixed().required("This Field is Required"),
    }),
    onSubmit: async (values) => {
      setBusy(true);
      if (type === creationTypeEnum.new) {
        await ProductService.createNewProduct(values, image.value)
          .then(() => successPopup("New product was created!"))
          .catch((err) => errorPopup(err.message));
        return null;
      }

      await ProductService.updateProduct(prod_id, values, image.value)
        .then(() => successPopup("Item: " + prod_id + " product was updated!"))
        .catch((err) => errorPopup(err.message));
    },
  });

  const imageValidation =
    requestForm.touched.img && requestForm.errors.img
      ? "bg-red-600 hover:bg-red-700 hover:text-white text-white"
      : "bg-white hover:bg-green-600 hover:text-white text-green-600";

  useEffect(() => {
    if (type === creationTypeEnum.update) {
      ProductService.getProduct(prod_id).then((res) => setEditData(res));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            ? "Create a New Service"
            : "Edit Product/Service"}
        </h1>

        {image.url !== null && (
          <div className="mx-auto mb-4">
            <img src={image.url} alt={image.alt} />
          </div>
        )}

        {image.value === null && (
          <div className="mx-auto mb-4">
            <img src={editData?.img_url} alt={editData?.img_alt} />
          </div>
        )}

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

        <ArrayInputComponent
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
          {type === creationTypeEnum.new
            ? "Create new Service"
            : "Save Changes"}
        </button>
      </div>
    </React.Fragment>
  );
};

export default CreateServiceModal;

const ArrayInputComponent = ({
  placeholder,
  name,
  label,
  formik,
  listLabel,
}) => {
  const [state, setState] = useState({ kilo: "", price: "" });
  const [array, setArray] = useState("");

  const addArrayState = () => {
    let arrayHolder = [];
    if (state.kilo !== "" && state.price !== "") {
      if (array === "") {
        arrayHolder = [...formik.values[name], JSON.stringify(state)];
      }
      if (array !== "") {
        arrayHolder = [...array, JSON.stringify(state)];
      }
      setArray(arrayHolder);
      setState({ kilo: "", price: "" });
    }
  };

  const listTitle = listLabel ? listLabel : label + " List";

  const deleteArrayState = (key) => {
    let arrayHolder = [...array];
    arrayHolder.splice(key, 1);
    if (arrayHolder.length === 0) {
      setArray("");
      formik.setFieldValue(name, array);
      formik.validateForm();
      return;
    }
    setArray(arrayHolder);
  };

  const { errors, touched } = formik;

  useEffect(() => {
    formik.setFieldValue(name, array);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [array]);

  return (
    <React.Fragment>
      {formik.values[name] !== "" && (
        <div className="text-left mb-2">
          <p className="font-bold">{listTitle}</p>
          {formik.values[name]?.map((element, key) => {
            const stringy = JSON.parse(element);
            return (
              <div key={key} className="flex flex-row items-center">
                <p className="ml-2 p-1 text-sm">
                  ~{" "}
                  {stringy?.kilo + " Kilograms / " + stringy?.price + " pesos"}
                </p>
                <HiOutlineMinusCircle
                  className="text-red-600 active:translate-y-1"
                  size={18}
                  onClick={() => deleteArrayState(stringy)}
                />
              </div>
            );
          })}
        </div>
      )}

      <div className="mb-3 w-full flex flex-col items-start object-contain">
        <label className="text-md" htmlFor={name}>
          {label ?? "Label"}
        </label>
        <div className="flex flex-row w-full gap-2 items-center">
          <input
            value={state?.kilo}
            className="appearance-none p-3 bg-gray-100 box-border border border-gray-300 rounded focus:outline-none focus:border-gray-600 object-contain flex-grow"
            placeholder={"Kilograms"}
            onChange={(e) => setState({ ...state, kilo: e.target.value })}
          />
          <input
            value={state?.price}
            className="appearance-none p-3 bg-gray-100 box-border border border-gray-300 rounded focus:outline-none focus:border-gray-600 object-contain flex-grow"
            placeholder={"Price in Pesos"}
            onChange={(e) => setState({ ...state, price: e.target.value })}
          />
          <MdAddCircleOutline
            className="text-green-600 active:translate-y-1 w-50"
            size={30}
            onClick={() => addArrayState()}
          />
        </div>
        {touched[name] && errors[name] ? (
          <span className="text-red-500 text-sm">{errors[name]}</span>
        ) : null}
      </div>
    </React.Fragment>
  );
};
