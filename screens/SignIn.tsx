import React, { useState } from "react";
import { StyleSheet, Image, useColorScheme } from "react-native";

import { useAppDispatch } from "../app/hooks";

import { View, TextInput, Button } from "../components/Themed";
import { authenticated, signIn } from "../hooks/authenticator";

import Images from "../utils/images";

async function doSignIn(
  dispatch,
  navigation,
  state: { username: string; password: string }
) {
  try {
    let { accessToken, refreshToken } = await signIn(
      state.username,
      state.password
    );
    dispatch(authenticated({ accessToken, refreshToken }));
  } catch (error) {
    console.error("Authentication failed: ", error);
  }
}

function navigateToSignUp(navigation) {
  navigation.navigate("SignUp");
}

function navigateToForgotPassword(navigation) {
  navigation.navigate("ForgotPassword");
}

export default function SignIn({ navigation }) {
  const dispatch = useAppDispatch();

  const [state, setState] = useState({
    username: "",
    password: "",
  });

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
          placeholder="Email" // TODO: i18n
          style={styles.emailInput}
          onChangeText={(email) => setState({ ...state, username: email })}
        />
        <TextInput
          placeholder="Password" // TODO: i18n
          style={styles.passwordInput}
          secureTextEntry={true}
          onChangeText={(password) => setState({ ...state, password })}
        />
        <Button
          title="Sign in" // TODO: i18n
          style={styles.signInButton}
          onPress={async () => doSignIn(dispatch, navigation, state)}
        />
      </View>

      <View style={styles.secondaryActions}>
        <Button
          title="Sign Up" // TODO: i18n
          color="secondary"
          onPress={() => navigateToSignUp(navigation)}
        />
        <Button
          title="Forgot Password" // TODO: i18n
          color="secondary"
          onPress={() => navigateToForgotPassword(navigation)}
        />
      </View>
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
  emailInput: {
    width: "80%",
    marginBottom: "5%",
  },
  passwordInput: {
    width: "80%",
    marginBottom: "5%",
  },
  signInButton: {
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
