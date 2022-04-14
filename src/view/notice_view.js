import { useNavigation } from "@react-navigation/native";
import { Icon, Layout, TopNavigationAction, TopNavigation, Text, Button } from "@ui-kitten/components";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { layouts } from "../helper/styles";

const NoticeView = () => {
  const next = useNavigation();

  const toServices = () => {
    next.reset({ index: 0, routes: [{ name: "Home" }] });
  };

  const BackAction = () => {
    return <TopNavigationAction icon={BackIcon} onPress={() => toServices()} />;
  };

  return (
    <SafeAreaView>
      <Layout style={layouts.screen}>
        <TopNavigation accessoryLeft={BackAction} title={() => <Text category="h6">Notice</Text>} />
        <Layout>
          <Text style={{ fontSize: 18, textAlign: "center", fontWeight: "bold", marginBottom: 10 }}>
            Apply for Service
          </Text>
          <Text style={{ fontSize: 50, color: "#C80048", fontWeight: "bold", textAlign: "center" }}>REJECTED</Text>
        </Layout>
        <Button style={{ margin: 15 }} onPress={() => toServices()}>
          <Text>RETURN TO SERVICE MENU</Text>
        </Button>
      </Layout>
    </SafeAreaView>
  );
};

export default NoticeView;

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;
