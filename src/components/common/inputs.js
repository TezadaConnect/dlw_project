import { Input, Layout, Select, SelectItem, Text } from "@ui-kitten/components";
import { StyleSheet } from "react-native";
import React, { useState } from "react";
// import RNPickerSelect from "react-native-picker-selec";

export const TextField = ({
  label,
  isPass = false,
  placeholder,
  name,
  formik,
}) => {
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

export const SelectField = ({
  item = [
    { value: "1", label: "Hello" },
    { value: "2", label: "High" },
  ],
  label,
  placeholder,
  name,
  formik,
}) => {
  const [selectedValue, setSelectedValue] = useState();
  const getSelectedValue = (row) => {
    item?.map((checker, key) => {
      if (key === row) {
        setSelectedValue(checker.label);
        return formik.setFieldValue(name, checker.value);
      }
    });
  };

  const { errors, touched } = formik;
  return (
    <Layout style={style.input}>
      <Text category="p2">{label}</Text>
      <Select
        value={selectedValue}
        placeholder={placeholder}
        onSelect={(selected) => {
          getSelectedValue(selected.row);
        }}
      >
        {item?.map((element, key) => (
          <SelectItem key={key} title={element?.label} />
        ))}
      </Select>
      {touched[name] && errors[name] ? (
        <Text category="label" style={style.errorColor}>
          {errors[name]}
        </Text>
      ) : null}
    </Layout>
  );
};
