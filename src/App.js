import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import React from "react";
import { Provider } from "react-redux";
import store from "./redux/store";
import AppRoute from "./router/app_route";
import * as eva from "@eva-design/eva";
import { LoadingScreen } from "./components/common/loading_screen";
import FlashMessage from "react-native-flash-message";
import registerNNPushToken from "native-notify";

export default function App() {
  registerNNPushToken(2746, "33W2w1mWUguk3y6DPPFDWL");
  console.disableYellowBox = true;
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
