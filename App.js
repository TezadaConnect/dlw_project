import React from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { StyleSheet, SafeAreaView } from "react-native";
import rootReducer from "./src/redux/reducers";

const store = configureStore({
  reducer: rootReducer,
});

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaView style={styles.container}>
        {/* <Text>Open up App.js to start working on your app!</Text>
        <StatusBar style="auto" /> */}
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
