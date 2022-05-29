import {
  Button,
  Icon,
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
} from "@ui-kitten/components";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TextField } from "../../components/common/inputs";
import { layouts } from "../../helper/styles";
import { useFormik } from "formik";

import * as Yup from "yup";

import { useDispatch, useSelector } from "react-redux";
import AuthService from "../../service/auth_service";
import { setBusy } from "../../redux/slices/response_slice";
import { showMessage } from "react-native-flash-message";

const ChangeImagePass = () => {
  const next = useNavigation();
  const dispatch = useDispatch();

  const loginForm = useFormik({
    enableReinitialize: true,
    initialValues: { password_c: "", password: "" },
    validationSchema: Yup.object({
      password: Yup.string().required("This field is required"),
      password_c: Yup.string()
        .required("This field is required")
        .oneOf([Yup.ref("password"), null], "Passwords must match"),
    }),
    onSubmit: (values) => {
      dispatch(setBusy(true));
      AuthService.changePassword(values.password)
        .then(() =>
          showMessage({
            message: "Success",
            description: "Updated Password Successfully",
            type: "success",
            icon: "success",
          })
        )
        .catch((err) => {
          console.log(err.message);
          showMessage({
            message: "Failed",
            description: err.message,
            type: "danger",
            icon: "danger",
          });
        });
      dispatch(setBusy(false));
      next.goBack();
    },
  });

  const BackAction = () => {
    return (
      <TopNavigationAction icon={BackIcon} onPress={() => next.goBack()} />
    );
  };

  return (
    <SafeAreaView>
      <Layout style={layouts.screen}>
        <TopNavigation
          accessoryLeft={BackAction}
          title={() => <Text category="h6">Change Password</Text>}
        />

        <Layout style={layouts.padding}>
          <TextField
            name="password"
            label="Password"
            placeholder="password"
            isPass={true}
            formik={loginForm}
          />
          <TextField
            name="password_c"
            label="Confirm Password"
            placeholder="confirm password"
            formik={loginForm}
            isPass={true}
          />
        </Layout>

        <Layout style={layouts.padding}>
          <Button onPress={loginForm.handleSubmit}>
            <Text>SUBMIT CHANGES</Text>
          </Button>
        </Layout>
      </Layout>
    </SafeAreaView>
  );
};

export default ChangeImagePass;

const style = StyleSheet.create({
  orText: {
    margin: 10,
    textAlign: "center",
  },
});

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;
