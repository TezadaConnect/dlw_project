import { StyleSheet } from "react-native";

export const layouts = StyleSheet.create({
  screen: {
    height: "100%",
    display: "flex",
    backgroundColor: "white",
    justifyContent: "space-between",
    flexDirection: "column",
  },

  padding: {
    padding: 15,
  },

  errColor: {
    color: "red",
  },
});
