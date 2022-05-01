import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { InputComponent, SelectComponent } from "../common/input_component";
import * as Yup from "yup";
import { PRODUCT_QUERY } from "../../services/product_service";
import { onSnapshot, query } from "@firebase/firestore";
import RequestService from "../../services/request_service";
import { creationTypeEnum } from "../../helpers/constant";
// import { useGetProducts } from "../../helpers/hooks/useStartDepHooks";

const validationStandard = Yup.string().required("This field is required");
const validationNumber = Yup.number()
  .typeError("Must be a number")
  .required("This field is required");

const CreateRequestModal = ({
  type = creationTypeEnum.new,
  req_id = null,
  is_walk = true,
  isAdmin = true,
}) => {
  const [lists, setLists] = useState({ products: [], kilo: [] });
  const [product, setProduct] = useState([]);
  const [updateData, setUpdateData] = useState();

  const listMaker = (collection) => {
    const prod_name = [];
    collection.forEach((item, key) => {
      prod_name.push({
        value: item?.id,
        label: item?.data?.service_name,
      });
    });
    setLists({ ...lists, products: prod_name });
  };

  const requestForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      customer_name: updateData?.customer_name ?? "",
      service_type: updateData?.service_type ?? "",
      address: updateData?.address ?? "",
      contact: updateData?.contact ?? "",
      kilogram: updateData?.kilogram ?? "",
      price: updateData?.price ?? "",
    },
    validationSchema: Yup.object({
      customer_name: validationStandard,
      service_type: validationStandard,
      address: validationStandard,
      contact: validationNumber,
      kilogram: validationNumber,
      price: validationNumber,
    }),
    onSubmit: async (values) => {
      if (type === creationTypeEnum.new) {
        await RequestService.createNewRequest(values, is_walk)
          .then(() => Swal.clickConfirm())
          .catch((err) => {
            console.log(err.message);
            Swal.clickDeny();
          });
      }

      if (type === creationTypeEnum.update) {
        RequestService.updateRequest(req_id, values, is_walk)
          .then(() => Swal.clickConfirm())
          .catch((err) => {
            console.log(err.message);
            Swal.clickDeny();
          });
      }
    },
  });

  const readRequestUpdate = () => {
    if (req_id !== null) {
      RequestService.readOneRequest(req_id, is_walk).then((snap) => {
        setUpdateData({ id: snap.id, ...snap.data() });
      });
    }
  };

  useEffect(() => {
    const unSub = onSnapshot(query(PRODUCT_QUERY), (snap) => {
      const collection = [];
      snap?.forEach((doc) => {
        collection.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setProduct(collection);
      listMaker(collection);
    });
    readRequestUpdate();
    return unSub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    product?.forEach((element) => {
      if (element.id === requestForm.values.service_type) {
        const rate_list = element?.data?.rate;
        const kilo = [];
        rate_list?.forEach((element) => {
          const parsed_value = JSON.parse(element);
          kilo.push({
            value: parsed_value?.kilo,
            label: parsed_value?.kilo,
            price: parsed_value?.price,
          });
        });
        return setLists({ ...lists, kilo: kilo ?? "" });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestForm.values.service_type]);

  useEffect(() => {
    const kiloList = lists?.kilo;
    kiloList?.forEach((element) => {
      if (parseFloat(requestForm?.values?.kilogram) === element?.value) {
        requestForm.setFieldValue("price", element?.price);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestForm.values.kilogram]);

  return (
    <React.Fragment>
      <div className="flex flex-col w-full">
        {isAdmin === true ? (
          <h1 className="text-left my-5 font-bold text-3xl text-black">
            {type === creationTypeEnum.new
              ? "Add New Request Form"
              : "Update Request"}
          </h1>
        ) : (
          <h1 className="text-left my-5 font-bold text-3xl text-black">
            Read Only Request
          </h1>
        )}

        <InputComponent
          name="customer_name"
          label="Customer Name"
          placeholder="customer"
          formik={requestForm}
        />

        <SelectComponent
          list={lists?.products}
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

        <SelectComponent
          list={lists.kilo}
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
          is_read={true}
        />

        {isAdmin === true ? (
          <button
            onClick={requestForm.handleSubmit}
            className="my-5 px-5 py-3 w-full rounded bg-black text-white hover:bg-gray-900 active:translate-y-1"
          >
            {type === creationTypeEnum.new ? "Add Request" : "Save Changes"}
          </button>
        ) : (
          <button
            onClick={() => Swal.close()}
            className="my-5 px-5 py-3 w-full rounded bg-black text-white hover:bg-gray-900 active:translate-y-1"
          >
            Close Modal
          </button>
        )}
      </div>
    </React.Fragment>
  );
};

export default CreateRequestModal;
