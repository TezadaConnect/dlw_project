import { Layout, Card, Text, Icon } from "@ui-kitten/components";
import { deleteIndieNotificationInbox } from "native-notify";
import { showMessage } from "react-native-flash-message";
import { TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setRefresh } from "../redux/slices/response_slice";

export const NotificationCard = ({ title, desc, date, id }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const handleDeleteNotification = async (notificationId) => {
    await deleteIndieNotificationInbox(
      user?.id,
      notificationId,
      2746,
      "33W2w1mWUguk3y6DPPFDWL"
    );

    dispatch(setRefresh());

    showMessage({
      message: "Success",
      description: "Notification deleted!",
      type: "success",
      icon: "success",
    });
  };
  return (
    <Card style={{ marginBottom: 5 }} disabled>
      <Text category={"p1"} style={{ fontWeight: "bold" }}>
        {title ?? "#Hello World!"}
      </Text>

      <Text style={{ marginTop: 5 }} category={"p1"} appearance="hint">
        {desc ?? "Lorem ipsum donor shucks!"}
      </Text>

      <Layout
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: "#00000000",
        }}
      >
        <Text style={{ marginTop: 5 }} category={"p2"} appearance="hint">
          {date ?? "4/23/2021"}
        </Text>

        <TouchableOpacity onPress={() => handleDeleteNotification(id)}>
          <Icon style={{ width: 20, height: 20 }} fill="#FF3D4A" name="trash" />
        </TouchableOpacity>
      </Layout>
    </Card>
  );
};
