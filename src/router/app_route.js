import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/slices/user_slice";
import LoginView from "../view/auth/login_view";
import RegisterView from "../view/auth/register_view";
import HomeView from "../view/home_view";
import { authentication } from "../config/firebase_config";
import { setBusy } from "../redux/slices/response_slice";
import TermsView from "../view/terms_view";
import NoticeView from "../view/notice_view";
import NotificationView from "../view/notification_view";
import AcquireView from "../view/acquire_view";
import StatusView from "../view/status_view";
import {
  useGetCurrentRequest,
  useGetProducts,
  useGetTimer,
  useGetTopProducts,
} from "../helper/hooks/use_start_dep_hooks";
import { registerIndieID } from "native-notify";

const Stack = createNativeStackNavigator();

const AppRoute = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  registerIndieID(user?.id, 2746, "33W2w1mWUguk3y6DPPFDWL");

  useEffect(async () => {
    dispatch(setBusy(true));
    onAuthStateChanged(authentication, (currentUser) => {
      if (currentUser) {
        dispatch(
          setUser({
            name: currentUser.displayName,
            email: currentUser.email,
            id: currentUser.uid,
          })
        );
      } else {
        dispatch(setUser(null));
      }
    });
    dispatch(setBusy(false));
    console.log(user);
  }, []);

  useGetProducts();
  useGetCurrentRequest();
  useGetTopProducts();
  useGetTimer();

  return (
    <React.Fragment>
      <NavigationContainer>
        <Stack.Navigator
          headerMode="none"
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Login" component={LoginView} />
          <Stack.Screen name="Register" component={RegisterView} />
          <Stack.Screen name="Home" component={HomeView} />
          <Stack.Screen name="Terms" component={TermsView} />
          <Stack.Screen name="Notification" component={NotificationView} />
          <Stack.Screen
            name="Acquire"
            initialParams={{ itemId: "" }}
            component={AcquireView}
          />
          <Stack.Screen name="Status" component={StatusView} />
          <Stack.Screen name="Notice" component={NoticeView} />
        </Stack.Navigator>
      </NavigationContainer>
    </React.Fragment>
  );
};

export default AppRoute;
