import { Input, Layout, Text } from "@ui-kitten/components";
import { StyleSheet } from "react-native";
import React from "react";

export const TextField = ({ label, isPass = false, placeholder, name, formik }) => {
  const { handleChange, values, errors, touched } = formik;
  return (
    <Layout style={style.input}>
      <Text category="p2">{label}</Text>
      <Input
        value={values[name]}
        onChangeText={handleChange(name)}
        secureTextEntry={isPass}
        placeholder={placeholder}
      />
      {touched[name] && errors[name] ? (
        <Text category="label" style={style.errorColor}>
          {errors[name]}
        </Text>
      ) : null}
    </Layout>
  );
};

TextField.defaultProps = {
  label: "Input Field",
  isPass: false,
  placeholder: "",
  name: "handle",
  formik: null,
};

const style = StyleSheet.create({
  input: {
    padding: 0,
    marginBottom: 15,
  },
  errorColor: {
    color: "#C80048",
  },
});
