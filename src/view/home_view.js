import { useNavigation } from "@react-navigation/native";
import {
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
  Icon,
  BottomNavigation,
  BottomNavigationTab,
} from "@ui-kitten/components";
import React, { useEffect, useRef, useState } from "react";
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
import { getUnreadIndieNotificationInboxCount } from "native-notify";
import NotificationView from "./notification_view";
import ActivityView from "./activity_view";
import ProfileView from "./profile_view";

const TITLE_ARR = ["Services", "Activity", "Notification", "Profile"];
const HomeView = () => {
  const { checkAgreement } = useAuthHook();

  const modalRef = useRef(null);

  checkAgreement();

  const topState = useBottomNavigationState();

  return (
    <SafeAreaView>
      <Layout style={layouts.screen}>
        <Layout>
          <TopNavigation
            accessoryRight={MenuAction}
            title={() => (
              <Text category="h6">{TITLE_ARR[topState.selectedIndex]}</Text>
            )}
          />
          <Layout style={{ position: "relative" }}>
            {topState.selectedIndex === 0 && (
              <HomeViewStaff modalRef={modalRef} />
            )}
            {topState.selectedIndex === 1 && <ActivityView />}
            {topState.selectedIndex === 2 && <NotificationView />}
            {topState.selectedIndex === 3 && <ProfileView />}
          </Layout>
        </Layout>

        <PortalProvider>
          <Layout style={{ position: "absolute" }}>
            <BottomSheetComponent modalRef={modalRef} />
          </Layout>
        </PortalProvider>

        <Layout
          style={{
            width: "100%",
            height: 50,
            backgroundColor: "#EE5407",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            bottom: 0,
          }}
        >
          <BottomNavigationAccessoriesShowcase topState={topState} />
        </Layout>
      </Layout>
    </SafeAreaView>
  );
};

export default HomeView;

const MenuAction = () => {
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
      <TopNavigationAction icon={Logout} onPress={() => logout()} />
    </Layout>
  );
};

const Logout = (props) => <Icon {...props} name="log-out-outline" />;

const style = StyleSheet.create({
  cardList: {
    margin: 5,
    display: "flex",
    flexDirection: "row",
  },
  bottomNavigation: {
    marginVertical: 8,
  },
});

const BellIcon = (props) => {
  const { user } = useSelector((state) => state.user);
  const { refresh } = useSelector((state) => state.response);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

  useEffect(async () => {
    let unreadCount = await getUnreadIndieNotificationInboxCount(
      user?.id,
      2746,
      "33W2w1mWUguk3y6DPPFDWL"
    );
    setUnreadNotificationCount(unreadCount);
  }, [refresh]);

  return (
    <React.Fragment>
      <Layout style={{ position: "relative" }}>
        <Icon {...props} name="bell-outline" />
        {unreadNotificationCount !== 0 ? (
          <Layout
            style={{
              height: 10,
              width: 10,
              backgroundColor: "#EB212E",
              borderRadius: 50,
              position: "absolute",
              top: -1,
              right: 0,
            }}
          />
        ) : null}
      </Layout>
    </React.Fragment>
  );
};
const PersonIcon = (props) => <Icon {...props} name="person-outline" />;

const EmailIcon = (props) => <Icon {...props} name="email-outline" />;

const HomeIcon = (props) => <Icon {...props} name="home-outline" />;

const useBottomNavigationState = (initialState = 0) => {
  const [selectedIndex, setSelectedIndex] = React.useState(initialState);
  return { selectedIndex, onSelect: setSelectedIndex };
};

const BottomNavigationAccessoriesShowcase = ({ topState }) => {
  return (
    <React.Fragment>
      <BottomNavigation style={style.bottomNavigation} {...topState}>
        <BottomNavigationTab title="HOME" icon={HomeIcon} />
        <BottomNavigationTab title="ACTIVITY" icon={EmailIcon} />
        <BottomNavigationTab title="NOTIFICATION" icon={BellIcon} />
        <BottomNavigationTab title="PROFILE" icon={PersonIcon} />
      </BottomNavigation>
    </React.Fragment>
  );
};

const HomeViewStaff = ({ modalRef }) => {
  const { product, topProduct } = useSelector((state) => state.product);
  return (
    <React.Fragment>
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
        {topProduct.map((item, key) => {
          return (
            <TopProductCardComponent
              key={key}
              count={key}
              title={item?.service_name}
              id={item?.id}
              reference={modalRef}
            />
          );
        })}
      </Layout>
    </React.Fragment>
  );
};
