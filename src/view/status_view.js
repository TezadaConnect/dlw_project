import {
  TopNavigation,
  Text,
  Layout,
  Icon,
  TopNavigationAction,
} from "@ui-kitten/components";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { layouts } from "../helper/styles";
import { PulseIndicator } from "react-native-indicators";
import CountDown from "react-native-countdown-component";
import { showMessage } from "react-native-flash-message";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { useGetTimer } from "../helper/hooks/use_start_dep_hooks";

const setChangesForRemainingDate = (value) => {
  let title = "";
  if (value === 1) title = "Pickup will come soon";
  if (value === 2) title = "Washing process";
  if (value === 3) title = "Items will be delivered soon";
  if (value === 4) title = "Service Completed!";
  if (value === 0) title = "Waiting for response";
  return title;
};

const PICKUP = [
  "WAITING",
  "PICKUP",
  "REJECT",
  "WASH",
  "HANDWASH",
  "DRY",
  "IRON",
  "FOLD",
  "DELIVERY",
  "DONE",
];

const StatusView = () => {
  const { currentRequest, time } = useSelector((state) => state.product);
  const [counter, setCounter] = useState(0);
  const [title, setTitle] = useState("Waiting for response");
  const colorValue = {
    indi1: counter >= 0 ? "#2ecc71" : "#d68f98",
    indi2: counter >= 1 ? "#2ecc71" : "#d68f98",
    indi3: counter >= 2 ? "#2ecc71" : "#d68f98",
    indi4: counter >= 3 ? "#2ecc71" : "#d68f98",
    indi5: counter >= 4 ? "#2ecc71" : "#d68f98",
  };

  const colorLineValue = {
    indi1: counter >= 0 ? "#2ecc71" : "transparent",
    indi2: counter >= 1 ? "#2ecc71" : "transparent",
    indi3: counter >= 2 ? "#2ecc71" : "transparent",
    indi4: counter >= 3 ? "#2ecc71" : "transparent",
    indi5: counter >= 4 ? "#2ecc71" : "transparent",
  };

  useEffect(() => {
    setTitle(setChangesForRemainingDate(counter));
  }, [counter]);

  useEffect(() => {
    const stateOfItem = currentRequest?.status ?? null;
    if (stateOfItem === PICKUP[0]) return setCounter(0);
    if (stateOfItem === PICKUP[1]) return setCounter(1);
    if (stateOfItem === PICKUP[8]) return setCounter(3);
    if (stateOfItem === PICKUP[9]) return setCounter(4);
    if (stateOfItem === PICKUP[2]) return setCounter(5);
    return setCounter(2);
  }, [currentRequest?.status ?? null]);

  useGetTimer();

  return (
    <SafeAreaView>
      <Layout style={layouts.screen}>
        <Layout>
          <TopNavigation
            accessoryLeft={BackAction}
            title={() => <Text category="h6">Service Status</Text>}
          />

          {counter === 5 ? (
            <Layout>
              <Layout>
                <Text
                  style={{
                    fontSize: 18,
                    textAlign: "center",
                    fontWeight: "bold",
                    marginBottom: 10,
                  }}
                >
                  Apply for Service
                </Text>
                <Text
                  style={{
                    fontSize: 50,
                    color: "#C80048",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  REJECTED
                </Text>
              </Layout>
              <Button style={{ margin: 15 }} onPress={() => toServices()}>
                <Text>RETURN TO SERVICE MENU</Text>
              </Button>
            </Layout>
          ) : (
            <Layout style={{ marginTop: 80 }}>
              <Text
                style={{ textAlign: "center", fontWeight: "bold" }}
                category="h6"
              >
                {title}.
              </Text>
              <Layout style={style.progressLayout}>
                <Layout
                  style={{
                    backgroundColor: colorValue.indi1,
                    ...style.dotLayout,
                  }}
                >
                  {counter === 0 ? <PulseIndicator color="#2ecc71" /> : null}
                </Layout>
                <Layout
                  style={{
                    flexGrow: 1,
                    height: 5,
                    backgroundColor: colorLineValue.indi2,
                  }}
                ></Layout>
                <Layout
                  style={{
                    backgroundColor: colorValue.indi2,
                    ...style.dotLayout,
                  }}
                >
                  {counter === 1 ? <PulseIndicator color="#2ecc71" /> : null}
                </Layout>
                <Layout
                  style={{
                    flexGrow: 1,
                    height: 5,
                    backgroundColor: colorLineValue.indi3,
                  }}
                ></Layout>
                <Layout
                  style={{
                    backgroundColor: colorValue.indi3,
                    ...style.dotLayout,
                  }}
                >
                  {counter === 2 ? <PulseIndicator color="#2ecc71" /> : null}
                </Layout>
                <Layout
                  style={{
                    flexGrow: 1,
                    height: 5,
                    backgroundColor: colorLineValue.indi4,
                  }}
                ></Layout>
                <Layout
                  style={{
                    backgroundColor: colorValue.indi4,
                    ...style.dotLayout,
                  }}
                >
                  {counter === 3 ? <PulseIndicator color="#2ecc71" /> : null}
                </Layout>
                <Layout
                  style={{
                    flexGrow: 1,
                    height: 5,
                    backgroundColor: colorLineValue.indi5,
                  }}
                ></Layout>
                <Layout
                  style={{
                    backgroundColor: colorValue.indi5,
                    ...style.dotLayout,
                  }}
                >
                  {counter === 4 ? <PulseIndicator color="#2ecc71" /> : null}
                </Layout>
              </Layout>

              <CountDown
                digitStyle={{ backgroundColor: "#FFF" }}
                until={time}
                onFinish={() => {
                  showMessage({
                    message: "Service done!",
                    icon: "success",
                    type: "success",
                  });
                }}
                onChange={(e) => {}}
                size={86400}
              />
            </Layout>
          )}
        </Layout>
      </Layout>
    </SafeAreaView>
  );
};

export default StatusView;

const style = StyleSheet.create({
  progressLayout: {
    marginHorizontal: 40,
    marginVertical: 50,
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  dotLayout: {
    borderRadius: 200,
    width: 20,
    height: 20,
  },
});

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
