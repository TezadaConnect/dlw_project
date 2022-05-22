import { useNavigation } from "@react-navigation/native";
import {
  Layout,
  TopNavigation,
  TopNavigationAction,
  Text,
  Icon,
} from "@ui-kitten/components";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { NotificationCard } from "../components/notification_components";
import { layouts } from "../helper/styles";
import { getIndieNotificationInbox } from "native-notify";
import { useDispatch, useSelector } from "react-redux";
import { ScrollView } from "react-native-gesture-handler";
import { setRefresh } from "../redux/slices/response_slice";

const NotificationView = () => {
  const [data, setData] = useState([]);
  const { user } = useSelector((state) => state.user);
  const { refresh } = useSelector((state) => state.response);

  const getNotify = async () => {
    let notifications = await getIndieNotificationInbox(
      user?.id,
      2746,
      "33W2w1mWUguk3y6DPPFDWL"
    );
    setData(notifications);
  };

  useEffect(() => {
    getNotify();
  }, [refresh]);

  return (
    <SafeAreaView>
      <Layout style={layouts.screen}>
        <Layout style={{ flex: 1 }}>
          <TopNavigation
            accessoryLeft={BackAction}
            title={() => <Text category="h6">Notificaions</Text>}
          />
          <ScrollView>
            <Layout
              style={{
                marginHorizontal: 15,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {data?.map((element, key) => {
                return (
                  <NotificationCard
                    key={key}
                    id={element?.notification_id}
                    title={element?.title}
                    desc={element?.message}
                    date={element?.date}
                  />
                );
              })}
            </Layout>
          </ScrollView>
        </Layout>
      </Layout>
    </SafeAreaView>
  );
};

export default NotificationView;

const BackAction = () => {
  const next = useNavigation();
  const dispatch = useDispatch();
  return (
    <TopNavigationAction
      icon={BackIcon}
      onPress={() => {
        dispatch(setRefresh());
        next.navigate("Home");
      }}
    />
  );
};

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;
