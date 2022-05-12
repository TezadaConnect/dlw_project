import { TopNavigation, Text, Layout, Button } from "@ui-kitten/components";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import useAuthHook from "../helper/hooks/auth_hook";
import { layouts } from "../helper/styles";

const TermsView = () => {
  const { agreedToTerms } = useAuthHook();
  return (
    <SafeAreaView>
      <Layout style={layouts.screen}>
        <TopNavigation
          title={() => <Text category="h6">TERMS AND CONDITIONS</Text>}
        />
        <Layout style={{ marginHorizontal: 5 }}>
          <ScrollView>
            <Layout style={{ marginTop: 5, marginHorizontal: 5 }}>
              <Text style={{ marginBottom: 5 }}>
                Rest assured, that for every customer, your satisfaction is our
                priority. Your clothes will be treated as our own. However, we
                still need to agree to some rules to ensure and prevent
                misunderstandings with DLW: Laundry Service.
              </Text>

              <Text style={{ marginBottom: 5 }}>
                By using our service, you agree that your clothes are suitable
                to be washed in water, on a normal cycle.
              </Text>

              <Text style={{ marginVertical: 10 }}>Lost Laundry</Text>
              <Text style={{ marginBottom: 5 }}>
                Since we cannot do inventory of every piece of your laundry as
                it is cost-prohibited. We cannot be held responsible for any
                lost laundry. However, for assurance, we tag all your bundles
                with your name and won't loose in out facility except, when it's
                inside the machine, laundry cart, or folding table.
              </Text>

              <Text style={{ marginVertical: 10 }}>Dry Cleaning Terms</Text>
              <Text style={{ marginBottom: 5 }}>
                We will do an inventory with your clothes once they arrived in
                the facility. In any case, damage in any dry cleaned items, will
                be refunded. Should you find an issue with any damages for your
                clothes and please notifyus within 24 hours. Concerns raised
                that exceeds 24 hours, will not be accepted.
              </Text>

              <Text style={{ marginVertical: 10 }}>Damaged Laundry</Text>
              <Text style={{ marginBottom: 5 }}>
                Before you acquire our service, please do make sure to check up
                your clothes with any stuffs (lipstick, chewing gum, pen, or a
                money) being inside the pocket that would cause damage to your
                clothes. Or else, we won't held responsible for the said damage.
                However, we reserve the right to decline laundries if we thinkit
                would cause us troubles.
              </Text>

              <Text style={{ marginVertical: 10 }}>
                GENERAL TERMS OF ALL SERVICES
              </Text>

              <Text>Scheduling and Payment</Text>
              <Text style={{ marginBottom: 5 }}>
                For walk-in service, schedule and payment will be through the
                inside of the company's premises. The claiming of laundry
                depends on how many kilos you want to acquire. You'll be seeing
                the menu inside the company's premises. You'll be informed about
                the claiming schedule. For pick-up service, schedule and payment
                will be through our android app. The claiming of laundry depends
                on how many kilos you want to acquire. You'll be seeing it in
                the details provided in the android app. The update of your
                laundry will be monitored using our application as well. The
                payment will be COD and with additional payment for exceed
                capacity of the laundry, if there's any.
              </Text>

              <Text style={{ marginVertical: 10 }}>
                Unattended Pick-up Delivery
              </Text>

              <Text style={{ marginBottom: 5 }}>
                If you request that we leave your laundry unattended (e.g., on
                your porch, in a hallway, or in your foyer) or with a third
                party (e.g., with a doorman or a neighbor), we are not
                responsible for your laundry before we have picked it up or
                after we have dropped it off. You also agree that our records of
                pick-up and drop-off times are true and accurate.
              </Text>

              <Text style={{ marginVertical: 10 }}>Miscellaneous</Text>
              <Text style={{ marginBottom: 5 }}>
                As time will pass by, there maybe changes with our service.
                Therefor we encourage you to check back frequently to
                familiarize yourself.
              </Text>
            </Layout>

            <Button
              style={{ margin: 5, marginTop: 30, marginBottom: 80 }}
              onPress={() => agreedToTerms()}
            >
              <Text>AGREE</Text>
            </Button>
          </ScrollView>
        </Layout>
      </Layout>
    </SafeAreaView>
  );
};

export default TermsView;
