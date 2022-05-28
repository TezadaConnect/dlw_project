import { useNavigation, useRoute } from "@react-navigation/native";
import {
  Icon,
  Layout,
  TopNavigation,
  TopNavigationAction,
  Text,
  Button,
} from "@ui-kitten/components";
import { useFormik } from "formik";
import { SafeAreaView } from "react-native-safe-area-context";
import { SelectField, TextField } from "../components/common/inputs";
import { layouts } from "../helper/styles";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ScrollView } from "react-native-gesture-handler";
import RequestService from "../service/request_service";
import { showMessage } from "react-native-flash-message";
import { setBusy } from "../redux/slices/response_slice";

const numberValidation = Yup.number()
  .typeError("Must be a number.")
  .required("This Field is required.");

const AcquireView = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const route = useRoute();
  const { product } = useSelector((state) => state.product);
  const [prodDetail, setProdDetail] = useState();
  const [rateString, setRateString] = useState([]);
  const next = useNavigation();
  const acquireForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      address: "",
      contact: user?.contact ?? "",
      load: "",
      service_type: prodDetail?.id ?? "",
      customer_name: user?.name,
      user_id: user?.id,
    },
    validationSchema: Yup.object({
      address: Yup.string().required("This Field is required."),
      contact: numberValidation,
      load: Yup.string().required("This Field is required."),
    }),
    onSubmit: async (values) => {
      dispatch(setBusy(true));
      await RequestService.createNewRequest(values)
        .then(() => {
          showMessage({
            message: "Request Sent!",
            description: "Request was successully sent",
            icon: "success",
            type: "success",
          });
          dispatch(setBusy(false));
          next.navigate("Status");
        })
        .catch((err) => {
          showMessage({
            message: "Action Denied",
            description: err.message,
            type: "danger",
            icon: "danger",
          });
          dispatch(setBusy(false));
        });
    },
  });

  const setDetailToView = () => {
    product?.map((item) => {
      if (item?.id === route.params.itemId) {
        return setProdDetail(item);
      }
    });
  };

  useEffect(() => {
    setDetailToView();
  }, [product]);

  useEffect(() => {
    const rateContainer = [];
    prodDetail?.rate?.map((item) => {
      rateContainer.push({
        value: `{"kilo": ${item.kilo}, "price": ${item.price}}`,
        label: `${item.kilo} Kilograms - ${item.price} PHP`,
      });
    });
    setRateString(rateContainer);
  }, [prodDetail]);

  return (
    <SafeAreaView>
      <Layout style={layouts.screen}>
        <Layout>
          <TopNavigation
            accessoryLeft={BackAction}
            title={() => (
              <Text category="h6">
                {prodDetail?.service_name ?? "Laundry Service"}
              </Text>
            )}
          />
          <ScrollView scrollEnabled={true}>
            <Layout
              style={{
                marginHorizontal: 15,
                marginBottom: 80,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Text style={{ marginBottom: 20 }} category="h6">
                Hello,
                <Text style={{ fontWeight: "bold" }} category="h6">
                  {user?.name}
                </Text>
              </Text>
              <Layout style={{ marginBottom: 10 }}>
                <Text>
                  Rating for the{" "}
                  <Text style={{ fontWeight: "bold" }}>
                    {prodDetail?.service_name ?? "Laundry Service"}
                  </Text>
                </Text>
                {prodDetail?.rate?.map((item, key) => {
                  return (
                    <Text key={key}>
                      + {item.kilo} Kilograms - {item.price} PHP
                    </Text>
                  );
                })}

                <Text style={{ marginVertical: 10 }}>
                  {prodDetail?.desc ??
                    "It is a bulk service that allows customers to: \n- drop off dirty. \n- pick up freshly cleaned, dried, and folded. \n\nThe whites are separated from colored. The folded laundry is packaged for and easy pick-up or delivery. It’s perfect for on-the-go customers!"}
                </Text>
              </Layout>

              <React.Fragment>
                <TextField
                  name="address"
                  label="Address"
                  formik={acquireForm}
                  placeholder="home address"
                />
                <TextField
                  name="contact"
                  label="Contact No."
                  formik={acquireForm}
                  placeholder="mobile or telephone"
                />
                <SelectField
                  item={rateString}
                  name="load"
                  label="Choose Rate"
                  formik={acquireForm}
                  placeholder="Rate"
                />
              </React.Fragment>

              <Button
                style={{ marginTop: 20 }}
                onPress={() => acquireForm.handleSubmit()}
              >
                <Text>SEND</Text>
              </Button>
            </Layout>
          </ScrollView>
        </Layout>
      </Layout>
    </SafeAreaView>
  );
};

export default AcquireView;

const BackAction = () => {
  const next = useNavigation();
  return (
    <TopNavigationAction
      icon={BackIcon}
      onPress={() => next.navigate("Home")}
    />
  );
};

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;
