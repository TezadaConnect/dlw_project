import { useNavigation } from "@react-navigation/native";
import { Button, Icon, Layout, Text } from "@ui-kitten/components";
import { onSnapshot, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/slices/user_slice";
import { USERS_QUERY } from "../service/auth_service";

const ProfileView = () => {
  const { user } = useSelector((state) => state.user);

  const [state, setState] = useState();
  const next = useNavigation();
  const disptach = useDispatch();

  useEffect(() => {
    const unSub = onSnapshot(query(USERS_QUERY), (snap) => {
      const collection = [];
      snap.forEach((doc) => {
        if (doc.id === user?.id) {
          collection.push({
            id: doc.id,
            ...doc.data(),
          });
        }
      });
      setState(collection[0]);
      disptach(
        setUser({
          id: user?.id,
          name: collection[0].fname + " " + collection[0].lname,
          email: collection[0].email,
          fname: collection[0].fname,
          lname: collection[0].lname,
          contact: collection[0].contact,
          img_url: collection[0].img_url,
          location: collection[0].location,
        })
      );
    });
    return unSub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      <Layout style={{ marginHorizontal: 10 }}>
        <Layout style={style.imgLayout}>
          <Layout style={style.imageAvatar}>
            <Image
              source={{
                uri: user?.img_url,
              }}
              resizeMode="cover"
              style={{
                alignSelf: "center",
                width: 100,
                height: 100,
                overflow: "hidden",
              }}
            />
          </Layout>
          <Layout style={{ marginLeft: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              {state?.fname + " " + state?.lname}
            </Text>
            <Text style={{ fontSize: 12, marginTop: 5 }}>id: {state?.id}</Text>
          </Layout>
        </Layout>

        <Layout
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            padding: 10,
            borderBottomWidth: 1,
          }}
        >
          <Icon style={style.icon} fill="#123020" name="email" />
          <Text style={{ marginLeft: 15, fontSize: 18, fontWeight: "bold" }}>
            {state?.email}
          </Text>
        </Layout>

        <Layout
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            padding: 10,
            borderBottomWidth: 1,
          }}
        >
          <Icon style={style.icon} fill="#123020" name="phone" />
          <Text style={{ marginLeft: 15, fontSize: 18, fontWeight: "bold" }}>
            {state?.contact}
          </Text>
        </Layout>

        <Layout
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            padding: 10,
            borderBottomWidth: 1,
          }}
        >
          <Icon style={style.icon} fill="#123020" name="map" />
          <Text style={{ marginLeft: 15, fontSize: 13, fontWeight: "normal" }}>
            {state?.location}
          </Text>
        </Layout>

        <Layout style={{ marginTop: 60 }}>
          <Button
            style={{ marginBottom: 10 }}
            onPress={() => {
              next.navigate("Register");
            }}
          >
            <Text>UPDATE PROFILE</Text>
          </Button>

          <Button
            style={{ marginBottom: 10 }}
            onPress={() => {
              next.navigate("ProfImage");
            }}
          >
            <Text>UPDATE IMAGE</Text>
          </Button>

          <Button
            style={{ marginBottom: 10 }}
            onPress={() => {
              next.navigate("Password");
            }}
          >
            <Text>UPDATE PASSWORD</Text>
          </Button>
        </Layout>
      </Layout>
    </React.Fragment>
  );
};

export default ProfileView;

const style = StyleSheet.create({
  imgLayout: {
    marginBottom: 30,
    textAlign: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 10,
  },
  imgStyle: {
    width: 100,
    height: 100,
  },
  icon: {
    width: 25,
    height: 25,
  },
  imageAvatar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    height: 100,
    overflow: "hidden",
    borderRadius: 100,
    backgroundColor: "gray",
  },
});
