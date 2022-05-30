import { useNavigation } from "@react-navigation/native";
import {
  TopNavigation,
  Text,
  Icon,
  TopNavigationAction,
  Layout,
  Button,
} from "@ui-kitten/components";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { layouts } from "../../helper/styles";
import { TextField } from "../../components/common/inputs";
import { useFormik } from "formik";
import * as Yup from "yup";
import useAuthHook from "../../helper/hooks/auth_hook";
import { useSelector } from "react-redux";

const RegisterView = () => {
  const { signup, editProfile } = useAuthHook();
  const { user } = useSelector((state) => state.user);
  const signupForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: user !== null ? user?.email : "",
      password: "",
      fname: user !== null ? user?.fname : "",
      lname: user !== null ? user?.lname : "",
      location: user !== null ? user?.location : "",
      contact: user !== null ? user?.contact : "",
      c_password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required("This field is required")
        .email("Must be a valid email"),
      password:
        user === null ? Yup.string().required("This field is required") : null,
      fname: Yup.string().required("This field is required"),
      lname: Yup.string().required("This field is required"),
      location: Yup.string().required("This field is required"),
      contact: Yup.number()
        .typeError("Must be a number")
        .required("This field is required"),
      c_password:
        user === null
          ? Yup.string()
              .required("This field is required")
              .oneOf([Yup.ref("password"), null], "Passwords must match")
          : null,
    }),
    onSubmit: (values) => {
      if (user !== null) {
        return editProfile(values);
      }
      signup(values);
    },
  });

  return (
    <SafeAreaView>
      <Layout style={layouts.screen}>
        <Layout>
          <TopNavigation
            accessoryLeft={BackAction}
            title={() => (
              <Text category="h6">
                {user !== null ? "Edit Info" : "Create an Account"}
              </Text>
            )}
          />

          <Layout style={style.textFieldLayout}>
            <TextField
              name="fname"
              label="First Name"
              placeholder="first name"
              formik={signupForm}
            />
            <TextField
              name="lname"
              label="Last Name"
              placeholder="last name"
              formik={signupForm}
            />
            <TextField
              name="email"
              label="Email"
              placeholder="email"
              formik={signupForm}
            />

            <TextField
              name="contact"
              label="Contact No."
              placeholder="contact no."
              formik={signupForm}
            />

            <TextField
              name="location"
              label="Address"
              placeholder="address"
              formik={signupForm}
            />

            {user === null ? (
              <React.Fragment>
                <TextField
                  name="password"
                  label="Password"
                  placeholder="password"
                  isPass={true}
                  formik={signupForm}
                />
                <TextField
                  name="c_password"
                  label="Confirm Password"
                  placeholder="confirm password"
                  isPass={true}
                  formik={signupForm}
                />
              </React.Fragment>
            ) : null}
          </Layout>
        </Layout>

        <Layout style={layouts.padding}>
          <Button onPress={signupForm.handleSubmit}>
            <Text>{user !== null ? "UPDATE INFO" : "SIGN UP"}</Text>
          </Button>
        </Layout>
      </Layout>
    </SafeAreaView>
  );
};

export default RegisterView;

const style = StyleSheet.create({
  textFieldLayout: {
    marginTop: "auto",
    ...layouts.padding,
  },
});

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

const BackAction = () => {
  const next = useNavigation();
  return <TopNavigationAction icon={BackIcon} onPress={() => next.goBack()} />;
};
