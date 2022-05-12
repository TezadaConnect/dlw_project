import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import React from "react";
import { Provider } from "react-redux";
import store from "./redux/store";
import AppRoute from "./router/app_route";
import * as eva from "@eva-design/eva";
import { LoadingScreen } from "./components/common/loading_screen";
import FlashMessage from "react-native-flash-message";

export default function App() {
  return (
    <Provider store={store}>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <AppRoute />
        <LoadingScreen />
        <FlashMessage position="bottom" />
      </ApplicationProvider>
    </Provider>
  );
}
