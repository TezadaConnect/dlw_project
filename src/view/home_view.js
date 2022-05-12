import { useNavigation } from "@react-navigation/native";
import {
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
  Icon,
  Button,
} from "@ui-kitten/components";
import React, { useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import useAuthHook from "../helper/hooks/auth_hook";
import { StyleSheet } from "react-native";
import {
  ProductCardComponent,
  TopProductCardComponent,
} from "../components/home_components";
import { layouts } from "../helper/styles";
import { ScrollView } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import BottomSheetComponent from "../components/common/bottom-sheet";
import { PortalProvider } from "@gorhom/portal";

const HomeView = () => {
  const next = useNavigation();
  const { checkAgreement } = useAuthHook();
  const { product } = useSelector((state) => state.product);

  checkAgreement();

  const modalRef = useRef(null);

  return (
    <SafeAreaView>
      <Layout style={layouts.screen}>
        <Layout>
          <TopNavigation
            accessoryRight={MenuAction}
            title={() => <Text category="h6">Services</Text>}
          />
          {product?.length !== 0 && (
            <ScrollView
              scrollEnabled={true}
              showsHorizontalScrollIndicator={false}
              horizontal
            >
              <Layout style={style.cardList}>
                {product?.map((item, key) => {
                  return (
                    <ProductCardComponent
                      reference={modalRef}
                      key={key}
                      title={item?.service_name}
                      imgUrl={item?.img_url}
                      id={item?.id}
                    />
                  );
                })}
              </Layout>
            </ScrollView>
          )}

          <Text style={{ fontWeight: "bold", margin: 10 }}>Top 3 Services</Text>
          <Layout style={{ margin: 5 }}>
            <TopProductCardComponent reference={modalRef} />
            <TopProductCardComponent reference={modalRef} />
            <TopProductCardComponent reference={modalRef} />
          </Layout>
        </Layout>

        <PortalProvider>
          <Layout>
            <BottomSheetComponent modalRef={modalRef} />
          </Layout>
        </PortalProvider>
      </Layout>
    </SafeAreaView>
  );
};

export default HomeView;

const MenuAction = () => {
  const next = useNavigation();
  const { logout } = useAuthHook();
  return (
    <Layout
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TopNavigationAction
        icon={BellIcon}
        onPress={() => next.navigate("Notification")}
      />
      <TopNavigationAction icon={Logout} onPress={() => logout()} />
    </Layout>
  );
};

const BellIcon = (props) => <Icon {...props} name="bell" />;
const Logout = (props) => <Icon {...props} name="log-out-outline" />;

const style = StyleSheet.create({
  cardList: {
    margin: 5,
    display: "flex",
    flexDirection: "row",
  },
});
