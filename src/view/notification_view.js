import { useNavigation } from "@react-navigation/native";
import {
  Layout,
  TopNavigation,
  TopNavigationAction,
  Text,
  Icon,
} from "@ui-kitten/components";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { NotificationCard } from "../components/notification_components";
import { layouts } from "../helper/styles";

const NotificationView = () => {
  return (
    <SafeAreaView>
      <Layout style={layouts.screen}>
        <Layout>
          <TopNavigation
            accessoryLeft={BackAction}
            title={() => <Text category="h6">Notificaions</Text>}
          />
          <Layout
            style={{
              marginHorizontal: 15,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <NotificationCard />
            <NotificationCard />
            <NotificationCard />
            <NotificationCard />
          </Layout>
        </Layout>
      </Layout>
    </SafeAreaView>
  );
};

export default NotificationView;

const BackAction = () => {
  const next = useNavigation();
  return (
    <TopNavigationAction
      icon={BackIcon}
      onPress={() => next.navigate("Home")}
    />
  );
};

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;
