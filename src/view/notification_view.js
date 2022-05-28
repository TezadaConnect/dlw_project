import { useNavigation } from "@react-navigation/native";
import { Layout } from "@ui-kitten/components";
import React, { useEffect, useState } from "react";
import { NotificationCard } from "../components/notification_components";
import { getIndieNotificationInbox } from "native-notify";
import { useSelector } from "react-redux";
import { ScrollView } from "react-native-gesture-handler";

const NotificationView = () => {
  const [data, setData] = useState([]);
  const { user } = useSelector((state) => state.user);
  const { refresh } = useSelector((state) => state.response);

  const getNotify = async () => {
    let notifications = await getIndieNotificationInbox(
      user?.id,
      2746,
      "33W2w1mWUguk3y6DPPFDWL"
    );
    setData(notifications);
  };

  useEffect(() => {
    getNotify();
  }, [refresh]);

  return (
    <Layout>
      <ScrollView>
        <Layout
          style={{
            marginHorizontal: 10,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {data?.map((element, key) => {
            return (
              <NotificationCard
                key={key}
                id={element?.notification_id}
                title={element?.title}
                desc={element?.message}
                date={element?.date}
              />
            );
          })}
        </Layout>
      </ScrollView>
    </Layout>
  );
};

export default NotificationView;
