import { TopNavigation, Text, Layout, Button } from "@ui-kitten/components";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { layouts } from "../helper/styles";
import { PulseIndicator } from "react-native-indicators";
import CountDown from "react-native-countdown-component";
import { showMessage } from "react-native-flash-message";
import useAuthHook from "../helper/hooks/auth_hook";

const StatusView = () => {
  const [counter, setCounter] = useState(0);
  const { logout } = useAuthHook();
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
    if (counter === 1) setTitle("Pickup will come soon");
    if (counter === 2) setTitle("Washing process");
    if (counter === 3) setTitle("Items will be delivered soon");
    if (counter === 4) setTitle("Service Completed!");
    if (counter === 0) setTitle("Waiting for response");
  }, [counter]);

  return (
    <SafeAreaView>
      <Layout style={layouts.screen}>
        <Layout>
          <TopNavigation
            title={() => <Text category="h6">Service Status</Text>}
          />
          <Layout style={{ marginTop: 80 }}>
            <Text
              style={{ textAlign: "center", fontWeight: "bold" }}
              category="h6"
            >
              {title}...
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
              until={20}
              onFinish={() => {
                setCounter(4);
                showMessage({
                  message: "Service done!",
                  icon: "success",
                  type: "success",
                });
                logout();
              }}
              // onPress={() => alert("hello")}
              onChange={(e) => {
                if (e === 15) {
                  setCounter(1);
                }
                if (e === 10) {
                  setCounter(2);
                }
                if (e === 5) {
                  setCounter(3);
                }
              }}
              size={20}
            />
          </Layout>
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
