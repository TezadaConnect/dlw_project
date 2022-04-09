import React from "react";
import { Provider } from "react-redux";
import store from "./src/redux/store";
import * as eva from "@eva-design/eva";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import AppRoute from "./src/router/app_route";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import FlashMessage from "react-native-flash-message";
import { LoadingScreen } from "./src/components/common/loading_screen";
import { SafeAreaView } from "react-native-safe-area-context";

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
