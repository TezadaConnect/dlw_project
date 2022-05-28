import { Card, Icon, Layout, Text } from "@ui-kitten/components";
import { StyleSheet } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "react-native-flash-message";
import { setRefresh } from "../redux/slices/response_slice";

export const ProductCardComponent = ({ title, imgUrl, id, reference }) => {
  const dispatch = useDispatch();
  const onOpen = () => {
    setTimeout(() => {
      reference.current?.open();
      showMessage({
        message: "Action Denied",
        description: "You currently have a request",
        type: "danger",
        icon: "danger",
      });
    }, 200);
    dispatch(setRefresh());
  };

  const next = useNavigation();

  const { currentRequest } = useSelector((state) => state.product);

  const navigateToRequire = () => {
    if (currentRequest?.status === "DONE")
      return next.navigate("Acquire", { itemId: id });

    if (currentRequest?.status === "REJECT")
      return next.navigate("Acquire", { itemId: id });

    if (currentRequest === null)
      return next.navigate("Acquire", { itemId: id });

    onOpen();
  };

  return (
    <React.Fragment>
      <TouchableOpacity onPress={() => navigateToRequire()}>
        <Layout style={style.cardProdLayout}>
          <ImageBackground
            source={{
              uri:
                imgUrl ??
                "https://amyslaundry.com/wp-content/uploads/2020/10/commercial-laundry-services-2-scaled.jpg",
            }}
            resizeMode="cover"
            style={style.img}
            borderRadius={5}
          >
            <LinearGradient
              colors={["#00000000", "black"]}
              start={{
                x: 0,
                y: 0,
              }}
              end={{
                x: 0,
                y: 1.2,
              }}
              style={style.box}
            >
              <Layout style={style.titleLayout}>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: "white",
                    textAlign: "center",
                    marginBottom: 10,
                  }}
                >
                  {title ?? "Hand Wash Service"}
                </Text>
              </Layout>
            </LinearGradient>
          </ImageBackground>
        </Layout>
      </TouchableOpacity>
    </React.Fragment>
  );
};

export const TopProductCardComponent = ({ count, title, id, reference }) => {
  const dispatch = useDispatch();
  const onOpen = () => {
    setTimeout(() => {
      reference.current?.open();
      showMessage({
        message: "Action Denied",
        description: "You currently have a request",
        type: "danger",
        icon: "danger",
      });
    }, 200);
    dispatch(setRefresh());
  };

  const next = useNavigation();

  const { currentRequest } = useSelector((state) => state.product);

  const navigateToRequire = () => {
    if (currentRequest?.status === "DONE")
      return next.navigate("Acquire", { itemId: id });

    if (currentRequest?.status === "REJECT")
      return next.navigate("Acquire", { itemId: id });

    if (currentRequest === null)
      return next.navigate("Acquire", { itemId: id });

    onOpen();
  };

  return (
    <React.Fragment>
      <Card style={style.cardTopProdLayout} onPress={() => navigateToRequire()}>
        <Layout
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            backgroundColor: "transparent",
          }}
        >
          <Text style={{ fontWeight: "bold" }}>
            {count + 1}. {title}
          </Text>
          <Icon
            style={{ width: 20, height: 20 }}
            fill="#8F9BB3"
            name="arrow-ios-forward-outline"
          />
        </Layout>
      </Card>
    </React.Fragment>
  );
};

export const ActivityLog = ({ item }) => {
  return (
    <Card style={{ marginHorizontal: 10, marginBottom: 5 }} disabled>
      <Layout style={{ marginBottom: 2 }}>
        <Text style={{ fontWeight: "bold", fontSize: 18 }}>
          {item?.id ?? "Hello World"}
        </Text>
      </Layout>
      <Layout
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
          marginBottom: 2,
        }}
      >
        <Text style={{ color: "grey", fontSize: 14 }}>
          {item?.type ?? "Full Service"}
        </Text>
        <Text style={{ color: "grey", fontSize: 14 }}>
          PHP {item?.price ?? 0.0}
        </Text>
      </Layout>
      <Layout>
        <Text style={{ color: "grey", fontSize: 12 }}>
          {item?.recieve_date ?? "3/30/2022"}
        </Text>
      </Layout>
    </Card>
  );
};

const style = StyleSheet.create({
  img: {
    flex: 1,
    justifyContent: "center",
  },
  cardProdLayout: {
    justifyContent: "flex-end",
    margin: 5,
    width: 200,
    height: 250,
    shadowOpacity: 1,
    shadowColor: "#8F9BB3",
    shadowOffset: {
      width: 5,
      height: 5,
    },
    borderRadius: 5,
  },
  cardTopProdLayout: {
    margin: 5,
  },
  titleLayout: {
    borderBottomEndRadius: 5,
    borderBottomStartRadius: 5,
    justifyContent: "flex-end",
    height: 250,
    width: 200,
    backgroundColor: "transparent",
    borderRadius: 5,
  },
  box: {
    height: 250,
    width: 200,
    borderRadius: 5,
  },
});
