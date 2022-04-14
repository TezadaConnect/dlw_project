import { Layout, Card, Text } from "@ui-kitten/components";

export const NotificationCard = ({ title, desc, date }) => {
  return (
    <Card style={{ marginBottom: 5 }}>
      <Layout style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
        <Text category={"p1"} style={{ fontWeight: "bold" }}>
          {title ?? "#Hello World!"}
        </Text>
        <Text category={"p2"} appearance="hint">
          {date ?? "4/23/2021"}
        </Text>
      </Layout>

      <Text style={{ marginTop: 5 }} category={"p2"} appearance="hint">
        {desc ?? "Lorem ipsum donor shucks!"}
      </Text>
    </Card>
  );
};
