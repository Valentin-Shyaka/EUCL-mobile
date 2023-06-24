import React, { useEffect, useState } from "react";
import { View, Text, Pressable, SafeAreaView, ScrollView } from "react-native";
import * as SecureStore from "expo-secure-store";
import tw from "twrnc";
import MyButton from "../../components/button";
import { purchaseElectricity, getPurchasedTokens } from "../../services/auth";
import { Avatar, Button, Card, Paragraph } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";

const Home = ({ navigation }) => {
  const [user, setUser] = useState("");
  const [purchasedTokens, setPurchasedTokens] = useState([]);
  const [authError, setAuthError] = useState("");
  const isFocused = useIsFocused();

  const getUserProfile = async () => {
    if (!profile?.data) return navigation.navigate("Login");
    setUser(profile?.data);
  };

  const getBoughtTokens = async () => {
    const res = await getPurchasedTokens();
    console.log(res);
    setPurchasedTokens(res?.data?.docs || []);
  };

  useEffect(() => {
    isFocused && getUserProfile() && getBoughtTokens();
  }, [isFocused]);

  const handleLogout = () => {
    SecureStore.deleteItemAsync("token");
    navigation.navigate("Login");
  };

  return (
    <View style={tw`h-full flex pt-20 items-center`}>
      <SafeAreaView>
        <ScrollView>
          <View>
            <Text style={tw`font-bold text-xl text-center`}>
              Welcome to EUCL ElecBuy
            </Text>
            <Text style={tw`font-bold text-xl text-center mb-10`}>
              {user.names}
            </Text>
            {purchasedTokens?.map((el) => (
              <View key={el._id} style={tw` mb-4 w-[80]`}>
                <Card>
                  <Card.Title
                    title={"Purchased date: " + el.purchased_date}
                    // subtitle={
                    //   authError !== "" ? (
                    //     <Text style={tw`mt-4 text-red-500 text-center`}>
                    //       {authError}
                    //     </Text>
                    //   ) : (
                    //     <Text>{el.total_tokens || 0} tokens</Text>
                    //   )
                    // }
                  />
                  <Card.Content>
                    <Paragraph>{"Meter number: " + el.meter_number}</Paragraph>
                  </Card.Content>
                  <Card.Content>
                    <Paragraph>{"Token: " + el.token}</Paragraph>
                  </Card.Content>
                  <Card.Content>
                    <Paragraph>{"Token status: " + el.token_status}</Paragraph>
                  </Card.Content>
                  <Card.Content>
                    <Paragraph>
                      {"Expire for: " + el.token_value_days + " days"}
                    </Paragraph>
                  </Card.Content>
                  <Card.Content>
                    <Paragraph>{"Paid: " + el.amount + "rwf"}</Paragraph>
                  </Card.Content>
                </Card>
              </View>
            ))}

            <View style={tw`mt-8`}>
              <Pressable
                onPress={() => {
                  navigation.navigate("purchasePower");
                }}
              >
                <MyButton
                  style={tw`bg-black text-white mb-4 w-full rounded-[10px]`}
                >
                  Purchase Power
                </MyButton>
              </Pressable>
              <Pressable onPress={handleLogout}>
                <MyButton
                  style={tw`bg-red-500 text-white mb-4 w-full rounded-[10px]`}
                >
                  LOGOUT
                </MyButton>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default Home;
