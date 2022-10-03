import React, { useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Image, StyleSheet } from "react-native";

import { Button, View, TextInput } from "../components/Themed";
import { AuthStackParamList } from "../types";

import {
  confirmSignUp,
  confirmSignIn,
  resendSignUp,
} from "../hooks/authenticator";
import { useAppDispatch } from "../app/hooks";

import Images from "../utils/images";

type ScreenProps = NativeStackScreenProps<AuthStackParamList, "VerifyCode">;

async function verify(
  dispatch,
  navigation,
  mode: "mfa" | "signup",
  username: string,
  code: string
) {
  try {
    console.log("code", code);
    if (mode == "mfa") {
      let res = await confirmSignIn(username, code);
      console.log("confirm signin response: ", res);
      // TODO: howto get accessToken?
      // dispatch(authenticated(accessToken));
    } else {
      await confirmSignUp(username, code);
      navigation.replace("SignIn");
    }
  } catch (error) {
    console.error("Signing up failed", error);
  }
}

async function doResendSignUp(username: string) {
  try {
    await resendSignUp(username);
  } catch (error) {
    console.error("Signing up failed", error);
  }
}

export default function Verify({ navigation, route }: ScreenProps) {
  console.log(
    `verify: username=${route.params.username},  type=${route.params.type}`
  );

  const dispatch = useAppDispatch();
  const [code, setCode] = useState("");

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={Images.id.logo}
          style={styles.headerImage}
          resizeMode="center"
        />
      </View>
      <View style={styles.primaryActions}>
        <TextInput
          placeholder="Code"
          style={styles.input}
          onChangeText={(code) => setCode(code)}
        />
        <Button
          title="Confirm"
          style={styles.button}
          onPress={() =>
            verify(
              dispatch,
              navigation,
              route.params.type,
              route.params.username,
              code
            )
          }
        />
      </View>
      {route.params.type != "mfa" ? (
        <View style={styles.secondaryActions}>
          <Button
            title="Resend Verification Code"
            style={styles.button}
            color="secondary"
            onPress={() => resendSignUp(route.params.username)}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: "10%",
    height: "15%",
  },
  headerImage: {
    width: "50%",
  },
  input: {
    width: "80%",
    marginBottom: "5%",
  },
  button: {
    width: "80%",
  },
  primaryActions: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: "30%",
    marginBottom: "30%",
  },
  secondaryActions: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
