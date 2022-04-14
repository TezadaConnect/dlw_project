import { Card, Icon, Layout, Text } from "@ui-kitten/components";
import { StyleSheet } from "react-native";
import React from "react";

export const ProductCardComponent = ({ title, imgUrl }) => {
  return (
    <React.Fragment>
      <Card style={style.cardProdLayout}>
        <Layout
          style={{
            backgroundColor: "transparent",
            height: "100%",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Text style={{ fontWeight: "bold" }}>{title ?? "Hand Wash Service"}</Text>
        </Layout>
      </Card>
    </React.Fragment>
  );
};

export const TopProductCardComponent = () => {
  return (
    <React.Fragment>
      <Card style={style.cardTopProdLayout}>
        <Layout
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            backgroundColor: "transparent",
          }}
        >
          <Text style={{ fontWeight: "bold" }}>{1}. Lorem ipsum card</Text>
          <Icon style={{ width: 20, height: 20 }} fill="#8F9BB3" name="arrow-ios-forward-outline" />
        </Layout>
      </Card>
    </React.Fragment>
  );
};

const style = StyleSheet.create({
  cardProdLayout: {
    margin: 5,
    width: 200,
    height: 250,
  },
  cardTopProdLayout: {
    margin: 5,
  },
});
