import React, { useEffect, useState } from "react";
import { Layout } from "@ui-kitten/components";
import { ActivityLog } from "../components/home_components";
import RequestService from "../service/request_service";
import { ScrollView } from "react-native";
import { useSelector } from "react-redux";

const ActivityView = () => {
  const [transaction, setTransaction] = useState();
  const { user } = useSelector((state) => state.user);
  const { refresh } = useSelector((state) => state.response);
  useEffect(() => {
    RequestService.getMyTransactions(user?.id)
      .then((res) => setTransaction(res))
      .catch((err) => console.log(err.message));
  }, [refresh]);
  return (
    <Layout style={{ marginBottom: 170 }}>
      <ScrollView>
        <Layout>
          {transaction?.map((element, key) => {
            return <ActivityLog key={key} item={element} />;
          })}
        </Layout>
      </ScrollView>
    </Layout>
  );
};

export default ActivityView;
