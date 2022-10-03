import { TypedUseSelectorHook, useSelector } from "react-redux";
import { createSlice, Dispatch, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

import * as SecureStore from "expo-secure-store";
import * as Random from "expo-random";

import "@ethersproject/shims";
import { ethers, Signer, Wallet } from "ethers";

const SECRET_STORE_PRIVATE_KEY = "private-key";

async function readWallet() {
  let privateKey: string | null = await SecureStore.getItemAsync(
    SECRET_STORE_PRIVATE_KEY
  );
  if (privateKey) {
    console.log("Found existing private key, initialize wallet using it");
    return new Wallet(privateKey);
  } else {
    null;
  }
}

async function createWallet() {
  console.log("Create new wallet");
  // NOTE: Wallet.createRandom() uses crypto.getRandomValues, but expo-random does
  // not provide this function correctly, so instead we go around this problem by
  // using expo-random to generate the needed random bytes and than manually
  // through Mnemonic variant of the wallet creation, we create wallet with random
  // value.
  // let wallet: Wallet = Wallet.createRandom();
  const randomBytes = await Random.getRandomBytesAsync(16);
  const mnemonic = ethers.utils.entropyToMnemonic(randomBytes);
  const wallet = ethers.Wallet.fromMnemonic(mnemonic);
  await SecureStore.setItemAsync(SECRET_STORE_PRIVATE_KEY, wallet.privateKey);
  return wallet;
}

async function checkWallet() {
  let wallet = await readWallet();
  if (!wallet) {
    wallet = await createWallet();
  }
  return wallet;
}

let wallet: Wallet | null = null;

export async function recoverWallet(dispatch: Dispatch, data: string) {
  if ((data.startsWith("0x") && data.length == 66) || data.length == 64) {
    wallet = new Wallet(data);
  } else {
    wallet = Wallet.fromMnemonic(data);
  }
  await SecureStore.setItemAsync(SECRET_STORE_PRIVATE_KEY, wallet.privateKey);
  let address = await wallet.getAddress();
  dispatch(initialized(address));
}

export async function initializeSigner(dispatch: Dispatch) {
  console.log("Initialize signer");
  wallet = await checkWallet();
  let address = await wallet.getAddress();
  dispatch(initialized(address));
}

export function getSigner(): Signer {
  if (wallet == null) {
    throw Error("Signer not initialized yet");
  }
  return wallet;
}

export function getWallet(): Wallet | null {
  return wallet;
}

export interface SignerState {
  address: string | null;
}

const initialSignerState = {
  address: null,
};

export const signerSlice = createSlice({
  name: "signer",
  initialState: initialSignerState,
  reducers: {
    initialized: (state: SignerState, action: PayloadAction<string>) => {
      console.log(`Signer initialized, address=${action.payload}`);
      state.address = action.payload;
    },
  },
});
export const { initialized } = signerSlice.actions;

export const useSignerSelector: TypedUseSelectorHook<RootState> = useSelector;
export const selectSignerAddress = (state: RootState) => state.signer.address;
