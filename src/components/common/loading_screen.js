import { Layout, Spinner } from "@ui-kitten/components";
import React from "react";
import { StyleSheet } from "react-native";
import { useSelector } from "react-redux";

export const LoadingScreen = () => {
  const { loading } = useSelector((state) => state.response);
  return (
    <React.Fragment>
      {loading && (
        <Layout style={style.spinnerLayout}>
          <Spinner size="giant" />
        </Layout>
      )}
    </React.Fragment>
  );
};

const style = StyleSheet.create({
  spinnerLayout: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
