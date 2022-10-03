import React, { useState } from "react";
import { StyleSheet, Image } from "react-native";

import { View, TextInput, Button } from "../components/Themed";
import { signUp } from "../hooks/authenticator";

import Images from "../utils/images";

async function doSignUp(
  navigation,
  credentials: {
    email: string;
    password: string;
    passwordConfirmation: string;
  }
) {
  console.log("signup", credentials);
  try {
    await signUp(credentials.email, credentials.password);
    navigation.navigate("VerifyCode", {
      username: credentials.email,
      type: "signup",
    });
  } catch (error) {
    console.error("Signing up failed", error);
  }
}

export default function SignUp({ navigation }) {
  const [state, setState] = useState({
    email: "",
    password: "",
    passwordConfirmation: "",
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
      <View style={styles.body}>
        <TextInput
          placeholder="Email" // TODO: i18n
          style={styles.emailInput}
          onChangeText={(email) => setState({ ...state, email })}
        />
        <TextInput
          placeholder="Password" // TODO: i18n
          style={styles.passwordInput}
          secureTextEntry={true}
          onChangeText={(password) => setState({ ...state, password })}
        />
        <TextInput
          placeholder="Confirm Password" // TODO: i18n
          style={styles.passwordInput}
          secureTextEntry={true}
          onChangeText={(password) =>
            setState({ ...state, passwordConfirmation: password })
          }
        />
        <Button
          title="Sign up" // TODO: i18n
          style={styles.signUpButton}
          onPress={async () => doSignUp(navigation, state)}
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
  body: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: "30%",
    marginBottom: "30%",
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
  signUpButton: {
    width: "80%",
  },
});
