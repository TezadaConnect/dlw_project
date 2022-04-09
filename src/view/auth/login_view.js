import { Button, Layout, Text, TopNavigation } from "@ui-kitten/components";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TextField } from "../../components/common/inputs";
import { layouts } from "../../helper/styles";
import { useFormik } from "formik";

import * as Yup from "yup";

import useAuthHook from "../../helper/hooks/auth_hook";
import FlashMessage from "react-native-flash-message";

const LoginView = () => {
  const next = useNavigation();
  const { login, checkUser } = useAuthHook();

  const [showAlert, setAlert] = useState(false);

  const loginForm = useFormik({
    enableReinitialize: true,
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string()
        .required("This field is required")
        .email("Must be a valid email"),
      password: Yup.string().required("This field is required"),
    }),
    onSubmit: async (values) => {
      login(values);
    },
  });

  checkUser();

  return (
    <SafeAreaView>
      <Layout style={layouts.screen}>
        <TopNavigation
          title={() => <Text category="h6">Login your Account</Text>}
        />

        <Layout style={layouts.padding}>
          <Layout style={style.imgLayout}>
            <Image
              source={require("../../../assets/img/logo.png")}
              resizeMode="contain"
              style={style.imgStyle}
            />
          </Layout>

          <TextField
            name="email"
            label="Email"
            placeholder="email"
            formik={loginForm}
          />
          <TextField
            name="password"
            label="Password"
            placeholder="password"
            isPass={true}
            formik={loginForm}
          />
        </Layout>

        <Layout style={layouts.padding}>
          <Button onPress={loginForm.handleSubmit}>
            <Text>LOGIN</Text>
          </Button>

          <Text style={style.orText} appearance="hint" category="p2">
            or
          </Text>

          <Button onPress={() => next.navigate("Register")}>
            <Text>CREATE AN ACCOUNT</Text>
          </Button>
        </Layout>
      </Layout>
    </SafeAreaView>
  );
};

export default LoginView;

const style = StyleSheet.create({
  orText: {
    margin: 10,
    textAlign: "center",
  },
  imgLayout: {
    marginBottom: 30,
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  imgStyle: {
    width: 300,
    height: 200,
  },
});
