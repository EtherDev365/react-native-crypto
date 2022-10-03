import { TypedUseSelectorHook, useSelector } from "react-redux";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import * as SecureStore from "expo-secure-store";

import axios from "axios";

import { RootState } from "../app/store";

export type AuthenticationData = {
  accessToken: string;
  refreshToken: string;
  expires: number;
};

const SECRET_STORE_AUTHENTICATION_DATA_KEY = "authentication";

export function readAuthenticationData(): Promise<AuthenticationData | null> {
  return SecureStore.getItemAsync(SECRET_STORE_AUTHENTICATION_DATA_KEY).then(
    (data) => (data ? JSON.parse(data) : null)
  );
}

export function storeAuthenticationData(data: AuthenticationData) {
  return SecureStore.setItemAsync(
    SECRET_STORE_AUTHENTICATION_DATA_KEY,
    JSON.stringify(data)
  );
}

export function resetAuthenticationData() {
  return SecureStore.deleteItemAsync(SECRET_STORE_AUTHENTICATION_DATA_KEY);
}

function authEndpoint(region) {
  return `https://cognito-idp.${region}.amazonaws.com`;
}

// NOTE: matches structure passed to aws-amplify configure
const CONFIG = {
  Auth: {
    region: "eu-central-1",
    userPoolId: "eu-central-1_IxLH0u0Nf",
    userPoolWebClientId: "3cegqe36o0u7lqkqv1i4thdjib",
    oauth: {
      scope: ["openid", "aws.cognito.signin.user.admin"],
    },
  },
};

async function currentUser(accessToken: string) {
  // Method: POST
  // Endpoint: https://cognito-idp.{REGION}.amazonaws.com/
  // Content-Type: application/x-amz-json-1.1
  // X-Amz-Target: AWSCognitoIdentityProviderService.GetUser
  // Body:
  // {
  //     "AccessToken" : "ACCESS_TOKEN",
  // }

  return axios({
    method: "get",
    url: authEndpoint(CONFIG.Auth.region),
    headers: {
      "Content-Type": "application/x-amz-json-1.1",
      "X-Amz-Target": "AWSCognitoIdentityProviderService.GetUser",
    },
    data: {
      AccessToken: accessToken,
    },
  })
    .then((response) => {
      console.debug("GetUser, response: ", response);
      return response.data;
    })
    .catch((error) => {
      console.log("error fetching user details", error);
    });
}

// TODO: implement flow supporting MFA
export async function signIn(
  username: string,
  password: string
): Promise<AuthenticationData> {
  // Method: POST
  // Endpoint: https://cognito-idp.{REGION}.amazonaws.com/
  // Content-Type: application/x-amz-json-1.1
  // X-Amz-Target: AWSCognitoIdentityProviderService.InitiateAuth
  // Body:
  // {
  //     "AuthParameters" : {
  //         "USERNAME" : "YOUR_USERNAME",
  //         "PASSWORD" : "YOUR_PASSWORD"
  //     },
  //     "AuthFlow" : "USER_PASSWORD_AUTH", // Don't have to change this if you are using password auth
  //     "ClientId" : "APP_CLIENT_ID"
  // }

  return axios({
    method: "post",
    url: authEndpoint(CONFIG.Auth.region),
    headers: {
      "Content-Type": "application/x-amz-json-1.1",
      "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth",
    },
    data: {
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: CONFIG.Auth.userPoolWebClientId,
    },
  })
    .then((response) => {
      const authData = {
        accessToken: response.data.AuthenticationResult.AccessToken,
        refreshToken: response.data.AuthenticationResult.RefreshToken,
        expires: Date.now() + response.data.AuthenticationResult.ExpiresIn,
      };
      return authData;
    })
    .catch((error) => {
      console.log("error signing in", error);
      throw error;
    });
}

// TODO: this should return `{ accessToken, exp }`
export async function confirmSignIn(username: string, code: string) {
  try {
    let res = null;
    throw Error("Not implemented!");
    console.log("ConfirmSignIn, response: ", res);
  } catch (error) {
    console.log("error confirming sign up", error);
    throw error;
  }
}

export async function signUp(email: string, password: string) {
  try {
    let res = null;
    throw Error("Not implemented!");
    console.log("Sign up response: ", res);
  } catch (error) {
    console.log("error signing up:", error);
    throw error;
  }
}

export async function resendSignUp(username: string) {
  try {
    let res = null;
    throw Error("Not implemented!");
    console.log("ResendSignUp:", res);
  } catch (error) {
    console.error("Failed", error);
    throw error;
  }
}

export async function confirmSignUp(username: string, code: string) {
  try {
    let res = null;
    throw Error("Not implemented!");
    console.log("ConfirmSignUp, response: ", res);
  } catch (error) {
    console.log("error confirming sign up", error);
    throw error;
  }
}

export async function forgotPassword(email: string) {
  // TODO: implement me!
  Promise.reject(Error("Not implemented"));
}

export async function signOut(refreshToken: string): Promise<void> {
  // Method: POST
  // Endpoint: https://cognito-idp.{REGION}.amazonaws.com/
  // Content-Type: application/x-amz-json-1.1
  // X-Amz-Target: AWSCognitoIdentityProviderService.InitiateAuth
  // Body:
  // {
  //    "ClientId": "APP_CLIENT_ID",
  //    "ClientSecret": "string", // optional, we don't support this at the moment
  //    "Token": "ACCESS_TOKEN"
  // }

  // TODO: for some reason the access token is not invalidated immediately after this

  return axios({
    method: "post",
    url: authEndpoint(CONFIG.Auth.region),
    headers: {
      "Content-Type": "application/x-amz-json-1.1",
      "X-Amz-Target": "AWSCognitoIdentityProviderService.RevokeToken",
      mode: "cors",
      cache: "no-cache",
    },
    data: {
      ClientId: CONFIG.Auth.userPoolWebClientId,
      Token: refreshToken,
    },
  })
    .then((response) => {
      console.debug("SignOut, response: ", response);
    })
    .catch((error) => {
      console.log("error signing out", error);
      throw error;
    });
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  expires: number | null;
}

const initialAuthState = {
  accessToken: null,
  refreshToken: null,
  expires: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    authenticated: (
      state: AuthState,
      action: PayloadAction<AuthenticationData>
    ) => {
      console.log("Authenticated: ", action.payload);
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.expires = action.payload.expires;
    },
    signedOut: (state: AuthState) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.expires = null;
      console.log("Signed out");
    },
  },
});
export const { authenticated, signedOut } = authSlice.actions;

export const useAuthSelector: TypedUseSelectorHook<RootState> = useSelector;
export const selectAuthState = (state: RootState) => state.auth;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectRefreshToken = (state: RootState) => state.auth.refreshToken;
