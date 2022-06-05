import { Button, Layout, Text } from "@ui-kitten/components";
import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { Portal } from "@gorhom/portal";
import { Modalize } from "react-native-modalize";
import { useDispatch, useSelector } from "react-redux";
import { PulseIndicator } from "react-native-indicators";
import CountDown from "react-native-countdown-component";
import { showMessage } from "react-native-flash-message";
import { useGetTimer } from "../../helper/hooks/use_start_dep_hooks";
import { setRefresh } from "../../redux/slices/response_slice";
import RequestService from "../../service/request_service";
import { setCounter } from "../../redux/slices/product_slice";

const { height } = Dimensions.get("screen");
const modalHeight = height * 0.5;

const setChangesForRemainingDate = (value) => {
  let title = "";
  if (value === 1) title = "Pickup will come soon";
  if (value === 2) title = "Washing process";
  if (value === 3) title = "Items will be delivered soon";
  if (value === 4) title = "Service Completed!";
  if (value === 0) title = "Waiting for response";
  return title;
};

const BottomSheetComponent = ({ modalRef }) => {
  const { currentRequest, time, counter } = useSelector(
    (state) => state.product
  );

  const dispatch = useDispatch();

  const onClose = () => {
    modalRef.current?.close();
  };

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
  }, []);

  useGetTimer();

  return (
    <Portal>
      <Modalize ref={modalRef} modalHeight={modalHeight}>
        <Layout style={styles.content}>
          <Text style={styles.text}>Service Status</Text>

          {counter === 5 ? (
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
          ) : (
            <Layout>
              <Layout style={{ marginTop: 20 }}>
                <Text
                  style={{ textAlign: "center", fontWeight: "bold" }}
                  category="h6"
                >
                  {title}.
                </Text>

                <Layout style={styles.progressLayout}>
                  <Layout
                    style={{
                      backgroundColor: colorValue.indi1,
                      ...styles.dotLayout,
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
                      ...styles.dotLayout,
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
                      ...styles.dotLayout,
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
                      ...styles.dotLayout,
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
                      ...styles.dotLayout,
                    }}
                  >
                    {counter === 4 ? <PulseIndicator color="#2ecc71" /> : null}
                  </Layout>
                </Layout>

                {counter !== 4 ? (
                  <CountDown
                    digitStyle={{ backgroundColor: "#FFF" }}
                    until={time}
                    onFinish={() => {
                      if (counter !== 4) {
                        RequestService.addFiveMunitesDelay(currentRequest?.id);
                        dispatch(setRefresh());
                        return showMessage({
                          message: "Service was Delayed!",
                          icon: "danger",
                          type: "danger",
                        });
                      }
                      showMessage({
                        message: "Service done!",
                        icon: "success",
                        type: "success",
                      });
                    }}
                    onChange={(e) => {}}
                    size={20}
                  />
                ) : (
                  <Text
                    style={{
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: 25,
                    }}
                  >
                    ITEM DELIVERED!
                  </Text>
                )}
              </Layout>
            </Layout>
          )}

          <Button onPress={() => onClose()}>Close</Button>
        </Layout>
      </Modalize>
    </Portal>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "space-between",
    height: modalHeight,
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: "white",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center",
    color: "black",
  },
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

export default BottomSheetComponent;
