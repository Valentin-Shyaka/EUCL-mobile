import React, { useState } from "react";
import { Text, SafeAreaView, ScrollView, View, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as Yup from "yup";
import { useFormik } from "formik";
import tw from "twrnc";

import Button from "../../components/button";
import { purchaseElectricity } from "../../services/auth";
import Input from "../../components/input";

const purchasePower = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const initialValues = {
    meter_number: "",
    amount: "",
  };
  const validationSchema = Yup.object().shape({
    meter_number: Yup.string().required("Meter number is required"),
    amount: Yup.number()
      .min(100)
      .required("Amount is required")
      .test(
        "multipleOf100",
        "Amount must be divisible by 100",
        (value) => value % 100 === 0
      ),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
  });

  const {
    handleChange,
    handleBlur,
    values,
    errors,
    touched,
    isValid,
    getFieldProps,
  } = formik;

  const handleSubmit = async () => {
    setLoading(true);
    setAuthError("");
    const res = await purchaseElectricity(values);
    setLoading(false);
    if (!res?.success) {
      let message = "Something went wrong";
      if (res?.message) {
        console.log(res?.message);
        message = res.message;
        if (message.includes("required pattern"))
          message = "invalid nationalId";
      }
      return setAuthError(message);
    }
    navigation.navigate("Home");
  };

  return (
    <View style={tw`h-[100%] bg-white  justify-end items-center`}>
      <SafeAreaView style={tw`h-[85%] w-full bg-white `}>
        <ScrollView>
          <View>
            <View style={tw`w-full`}>
              <Text style={tw`text-center font-extrabold text-xl`}>
                Purchase Electricity
              </Text>
            </View>

            {authError.length > 0 && (
              <Text style={tw`mt-4 text-red-500 text-center`}>{authError}</Text>
            )}
            <View style={tw`mt-8`}>
              <View style={tw`px-6 py-2`}>
                <Input
                  Icon={
                    <MaterialIcons
                      name="account-balance"
                      size={24}
                      color="silver"
                    />
                  }
                  placeholder="Meter number"
                  onChangeText={handleChange("meter_number")}
                  onBlur={handleBlur("meter_number")}
                  value={values.meter_number}
                  borderColor={
                    touched.meter_number && errors.meter_number ? "red" : "gray"
                  }
                />
                {touched.meter_number && errors.meter_number && (
                  <Text style={tw`text-red-500`}>{errors.meter_number}</Text>
                )}

                <Input
                  Icon={
                    <MaterialIcons
                      name="attach-money"
                      size={24}
                      color="silver"
                    />
                  }
                  placeholder="Amount"
                  onChangeText={handleChange("amount")}
                  onBlur={handleBlur("amount")}
                  value={values.amount}
                  borderColor={touched.amount && errors.amount ? "red" : "gray"}
                />
                {touched.amount && errors.amount && (
                  <Text style={tw`text-red-500`}>{errors.amount}</Text>
                )}

                <View style={tw`mt-8`}>
                  <Button
                    mode={"contained"}
                    style={tw`bg-[#FF0000] w-full p-[10] mt-4`}
                    onPress={handleSubmit}
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </Button>

                  <Pressable onPress={() => navigation.navigate("Home")}>
                    <View style={tw`mt-4`}>
                      <Text style={tw`text-xl underline text-gray-500`}>
                        Back
                      </Text>
                    </View>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default purchasePower;
