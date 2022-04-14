import { useNavigation } from "@react-navigation/native";
import { Button, Layout, Text, TopNavigation, TopNavigationAction, Icon, Card } from "@ui-kitten/components";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import useAuthHook from "../helper/hooks/auth_hook";
import { StyleSheet } from "react-native";
import { ProductCardComponent, TopProductCardComponent } from "../components/home_components";
import { layouts } from "../helper/styles";
import { ScrollView } from "react-native-gesture-handler";
// import { createDrawerNavigator } from "@react-navigation/drawer";

const HomeView = () => {
  const next = useNavigation();
  const { logout, checkAgreement } = useAuthHook();
  // const { user } = useSelector((state) => state.user);

  checkAgreement();
  return (
    <SafeAreaView>
      <Layout style={layouts.screen}>
        <Layout>
          <TopNavigation accessoryRight={MenuAction} title={() => <Text category="h6">Services</Text>} />
          <ScrollView scrollEnabled={true} showsHorizontalScrollIndicator={false} horizontal>
            <Layout style={style.cardList}>
              <ProductCardComponent />
              <ProductCardComponent />
              <ProductCardComponent />
            </Layout>
          </ScrollView>

          <Text style={{ fontWeight: "bold", margin: 10 }}>Top 3 Services</Text>
          <Layout style={{ margin: 5 }}>
            <TopProductCardComponent />
            <TopProductCardComponent />
            <TopProductCardComponent />
          </Layout>
        </Layout>

        <Button onPress={() => next.navigate("Status")}>
          <Text>LOGOUT</Text>
        </Button>
      </Layout>
    </SafeAreaView>
  );
};

export default HomeView;

const MenuAction = () => {
  const next = useNavigation();
  return <TopNavigationAction icon={BellIcon} onPress={() => next.navigate("Notification")} />;
};

const BellIcon = (props) => <Icon {...props} name="bell" />;

const style = StyleSheet.create({
  cardList: {
    margin: 5,
    display: "flex",
    flexDirection: "row",
  },
});
