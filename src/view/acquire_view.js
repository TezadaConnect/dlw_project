import { useNavigation } from "@react-navigation/native";
import { Icon, Layout, TopNavigation, TopNavigationAction, Text, Button } from "@ui-kitten/components";
import { useFormik } from "formik";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextField } from "../components/common/inputs";
import { layouts } from "../helper/styles";
import * as Yup from "yup";
import React from "react";
import { useSelector } from "react-redux";
import { ScrollView } from "react-native-gesture-handler";

const Rating = [
  { kilo: "8", price: "130" },
  { kilo: "9", price: "140" },
  { kilo: "10", price: "150" },
];

const numberValidation = Yup.number().typeError("Must be a number.").required("This Field is required.");

const AcquireView = ({ service }) => {
  const { user } = useSelector((state) => state.user);
  const acquireForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      address: "",
      contact: "",
      load: "",
      name: user.name,
    },
    validationSchema: Yup.object({
      address: Yup.string().required("This Field is required."),
      contact: numberValidation,
      load: numberValidation,
    }),
    onSubmit: (values) => {},
  });
  return (
    <SafeAreaView>
      <Layout style={layouts.screen}>
        <Layout>
          <TopNavigation
            accessoryLeft={BackAction}
            title={() => <Text category="h6">{service ?? "Laundry"} Service</Text>}
          />
          <ScrollView scrollEnabled={true}>
            <Layout style={{ marginHorizontal: 15, marginBottom: 80, display: "flex", flexDirection: "column" }}>
              <Text style={{ marginBottom: 20 }} category="h6">
                Hello,
                <Text style={{ fontWeight: "bold" }} category="h6">
                  {user?.name}
                </Text>
              </Text>
              <Layout style={{ marginBottom: 10 }}>
                <Text>
                  Rating for the <Text style={{ fontWeight: "bold" }}>{service ?? "Laundry"} Service</Text>
                </Text>
                {Rating?.map((item, key) => {
                  return (
                    <Text key={key}>
                      + {item.kilo} Kilograms - {item.price} PHP
                    </Text>
                  );
                })}

                <Text style={{ marginVertical: 10 }}>
                  {
                    "It is a bulk service that allows customers to: \n- drop off dirty. \n- pick up freshly cleaned, dried, and folded. \n\nThe whites are separated from colored. The folded laundry is packaged for and easy pick-up or delivery. It’s perfect for on-the-go customers!"
                  }
                </Text>
              </Layout>

              <React.Fragment>
                <TextField name="address" label="Address" formik={acquireForm} placeholder="home address" />
                <TextField name="contact" label="Contact No." formik={acquireForm} placeholder="mobile or telephone" />
                <TextField name="load" label="Load in Kg." formik={acquireForm} placeholder="kilograms" />
              </React.Fragment>

              <Button style={{ marginTop: 20 }} onPress={() => acquireForm.handleSubmit()}>
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
  return <TopNavigationAction icon={BackIcon} onPress={() => next.navigate("Home")} />;
};

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;
