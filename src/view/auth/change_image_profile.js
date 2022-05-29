import {
  Button,
  Icon,
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
} from "@ui-kitten/components";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { layouts } from "../../helper/styles";
import { useDispatch } from "react-redux";

import { launchImageLibraryAsync, MediaTypeOptions } from "expo-image-picker";
import { showMessage } from "react-native-flash-message";
import AuthService from "../../service/auth_service";

const ChangeImageProfile = () => {
  const next = useNavigation();
  const dispatch = useDispatch();

  const [state, setState] = useState(null);

  const openGalery = async () => {
    const option = {
      selectionLimit: 1,
      allowsEditing: true,
      mediaType: "photo",
      allowsEditing: false,
      base64: true,
      quality: 1,
    };

    const sean = await launchImageLibraryAsync({});
    AuthService.updateProfileImage("", sean.base64);
    setState(sean.uri);
  };

  const BackAction = () => {
    return (
      <TopNavigationAction icon={BackIcon} onPress={() => next.goBack()} />
    );
  };

  return (
    <SafeAreaView>
      <Layout style={layouts.screen}>
        <TopNavigation
          accessoryLeft={BackAction}
          title={() => <Text category="h6">Change Profile</Text>}
        />

        <Layout style={layouts.padding}>
          <Layout style={style.imgLayout}>
            <Image
              source={{
                uri:
                  state ??
                  "https://cdn-icons-png.flaticon.com/512/219/219983.png",
              }}
              resizeMode="contain"
              style={{ width: 200, height: 200, borderRadius: 100 }}
            />
          </Layout>
        </Layout>

        <Layout style={layouts.padding}>
          <Layout style={{ paddingBottom: 10 }}>
            <Button onPress={() => openGalery()}>
              <Text>OPEN GALLERY</Text>
            </Button>
          </Layout>

          <Button onPress={() => openGalery()}>
            <Text>SUBMIT CHANGES</Text>
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
  imgLayout: {
    marginBottom: 30,
    textAlign: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
});

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;
