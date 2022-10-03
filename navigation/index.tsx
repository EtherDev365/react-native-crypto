/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ColorSchemeName, Image } from "react-native";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import HomeScreen from "../screens/Home";
import ProfileScreen from "../screens/Profile";
import SettingsScreen from "../screens/Settings";
import SignInScreen from "../screens/SignIn";
import SignUpScreen from "../screens/SignUp";
import VerifyCodeScreen from "../screens/VerifyCode";
import ForgotPasswordScreen from "../screens/ForgotPassword";
import WalletScreen from "../screens/Wallet";
import SendXCFScreen from "../screens/SendXCF";
import {
  AuthStackParamList,
  HomeStackParamList,
  RootStackParamList,
  RootTabParamList,
} from "../types";
import LinkingConfiguration from "./LinkingConfiguration";

import Images from "../utils/images";
import { selectAccessToken, useAuthSelector } from "../hooks/authenticator";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator initialRouteName="SignIn">
      <AuthStack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{ title: "Sign In", headerShown: false }} // TODO: i18n
      />
      <AuthStack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{ title: "Sign Up", headerShown: false }} // TODO: i18n
      />
      <AuthStack.Screen
        name="VerifyCode"
        component={VerifyCodeScreen}
        options={{ title: "Verify Code", headerShown: false }} // TODO: i18n
      />
      <AuthStack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ title: "Forgot Password", headerShown: false }} // TODO: i18n
      />
    </AuthStack.Navigator>
  );
}

const HomeStack = createNativeStackNavigator<HomeStackParamList>();

function HomeNavigator() {
  return (
    <HomeStack.Navigator initialRouteName="Root">
      <HomeStack.Screen
        name="Root"
        component={HomeScreen}
        options={{ title: "Home", headerShown: false }}
      />
      <HomeStack.Screen
        name="Wallet"
        component={WalletScreen}
        options={{ title: "Receive XCF", headerShown: false }}
      />
      <HomeStack.Screen
        name="SendXCF"
        component={SendXCFScreen}
        options={{ title: "Send XCF", headerShown: false }}
      />
    </HomeStack.Navigator>
  );
}

const RootStack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const accessToken = useAuthSelector(selectAccessToken);
  return (
    <RootStack.Navigator>
      {accessToken ? (
        <RootStack.Screen
          name="Main"
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />
      ) : (
        <RootStack.Screen
          name="Auth"
          component={AuthNavigator}
          options={{ headerShown: false }}
        />
      )}
    </RootStack.Navigator>
  );
}

const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarLabel: () => null, // hide labels
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={HomeNavigator}
        options={{
          title: "Home", // TODO: i18n
          headerShown: false,
          tabBarIcon: ({ focused, color }) => {
            let image = focused ? Images.id.homeSelected : Images.id.home;
            return <TabBarIcon source={image} color={color} />;
          },
        }}
      />
      <BottomTab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: "Settings", // TODO: i18n
          tabBarIcon: ({ focused, color }) => {
            let image = focused
              ? Images.id.settingsSelected
              : Images.id.settings;
            return <TabBarIcon source={image} color={color} />;
          },
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Profile", // TODO: i18n
          tabBarIcon: ({ focused, color }) => {
            let image = focused ? Images.id.accountSelected : Images.id.account;
            return <TabBarIcon source={image} color={color} />;
          },
        }}
      />
    </BottomTab.Navigator>
  );
}

function TabBarIcon(props: { source: string; color: string }) {
  return (
    <Image source={props.source} color={props.color} resizeMode="center" />
  );
}
