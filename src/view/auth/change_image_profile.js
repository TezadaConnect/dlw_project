import {
  Button,
  Icon,
  Layout,
  Spinner,
  Text,
  TopNavigation,
  TopNavigationAction,
} from "@ui-kitten/components";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { layouts } from "../../helper/styles";
import { useDispatch, useSelector } from "react-redux";

import { launchImageLibraryAsync, MediaTypeOptions } from "expo-image-picker";
import { showMessage } from "react-native-flash-message";
import AuthService from "../../service/auth_service";

const ChangeImageProfile = () => {
  const next = useNavigation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const [state, setState] = useState({
    uri: null,
    base64: null,
  });

  const openGalery = async () => {
    const option = {
      selectionLimit: 1,
      allowsEditing: true,
      mediaType: "photo",
      allowsEditing: false,
      base64: true,
      quality: 1,
    };

    const img_container = await launchImageLibraryAsync({});
    setState({ uri: img_container.uri, base64: img_container.base64 });
  };

  const submitImage = () => {
    if (state.uri !== null) {
      setLoading(true);
      return AuthService.updateProfileImage(user?.id, state.uri)
        .then(() => {
          setLoading(false);

          showMessage({
            message: "Success",
            description: "Image was Uploaded sent",
            icon: "success",
            type: "success",
          });

          return next.goBack();
        })
        .catch((err) => {
          setLoading(false);
          return showMessage({
            message: "Failed",
            description: err.message,
            type: "danger",
            icon: "danger",
          });
        });
    }

    return showMessage({
      message: "Failed",
      description: "Please Choose another image.",
      type: "danger",
      icon: "danger",
    });
  };

  const BackAction = () => {
    return (
      <TopNavigationAction icon={BackIcon} onPress={() => next.goBack()} />
    );
  };

  const [load, setLoading] = useState();

  if (load === true) {
    return (
      <Layout
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spinner size="giant" />
      </Layout>
    );
  }

  return (
    <SafeAreaView>
      <Layout style={layouts.screen}>
        <TopNavigation
          accessoryLeft={BackAction}
          title={() => <Text category="h6">Change Profile</Text>}
        />

        <Layout style={style.layoutImage}>
          <View style={style.imgLayout}>
            <Image
              source={{
                uri: state.uri ?? user?.img_url,
              }}
              resizeMode="cover"
              style={{
                alignSelf: "center",
                width: 200,
                height: 200,
                overflow: "hidden",
              }}
            />
          </View>
        </Layout>

        <Layout style={layouts.padding}>
          <Layout style={{ paddingBottom: 10 }}>
            <Button onPress={() => openGalery()}>
              <Text>OPEN GALLERY</Text>
            </Button>
          </Layout>

          <Button onPress={() => submitImage()}>
            <Text>UPLOAD IMAGE</Text>
          </Button>
        </Layout>
      </Layout>
    </SafeAreaView>
  );
};

export default ChangeImageProfile;

const style = StyleSheet.create({
  orText: {
    margin: 10,
    textAlign: "center",
  },
  layoutImage: {
    paddingHorizontal: 15,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  imgLayout: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 200,
    height: 200,
    overflow: "hidden",
    borderRadius: 300,
    backgroundColor: "gray",
  },
});

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;
