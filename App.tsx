import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { Provider } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";

import waitForCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import { authenticated, readAuthenticationData } from "./hooks/authenticator";
import Navigation from "./navigation";

import { initializeSigner } from "./hooks/signer";

import { store } from "./app/store";

async function checkAuthentication(dispatch: Dispatch) {
  try {
    let authenticationData = await readAuthenticationData();
    if (authenticationData) {
      dispatch(authenticated(authenticationData));
    }
  } catch (e) {
    console.log("Checking authentication data failed:", e);
    // Do nothing and treat as user not being authenticated.
    //
    // Separating other errors from user not being authenticated
    // is a bit tricky as we receive only a string telling
    // what went wrong.
  }
}

function initialize() {
  const [isInitialized, setInitialized] = useState(false);

  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    async function innerAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        await Promise.all([
          waitForCachedResources(),
          checkAuthentication(store.dispatch),
          initializeSigner(store.dispatch),
        ]);
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.error(e);
      } finally {
        setInitialized(true);
        SplashScreen.hideAsync();
      }
    }

    innerAsync();
  }, []);

  return isInitialized;
}

function App() {
  const isInitialized = initialize();
  const colorScheme = useColorScheme();

  if (!isInitialized) {
    return null;
  } else {
    return (
      <Provider store={store}>
        <SafeAreaProvider>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </SafeAreaProvider>
      </Provider>
    );
  }
}

export default App;
