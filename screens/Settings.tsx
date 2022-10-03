import React, { useState, useEffect } from "react";
import { Modal, StyleSheet, TouchableOpacity } from "react-native";
import { BarCodeScanner, PermissionStatus } from "expo-barcode-scanner";
import QRCode from "react-native-qrcode-svg";
import * as Clipboard from "expo-clipboard";

import { Button, Text, View } from "../components/Themed";

import Images from "../utils/images";

import { selectRefreshToken, useAuthSelector } from "../hooks/authenticator";

import { useAppDispatch } from "../app/hooks";
import { signOut, signedOut } from "../hooks/authenticator";
import { recoverWallet, getWallet } from "../hooks/signer";

async function doSignOut(refreshToken: string, dispatch, navigation) {
  try {
    await signOut(refreshToken);
    await dispatch(signedOut());
  } catch (error) {
    console.error("Failed to signout: ", error);
    throw error;
  }
}

function QRCodeScanner({ onScanResult }) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === PermissionStatus.GRANTED);
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    onScanResult(type, data);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
    </View>
  );
}

function PrivateKeyDetails({ wallet, onDone }) {
  const onError = (err) => {
    console.error("Failed to create QR code for transction ID", err);
  };
  const [svg, setSvg] = useState(null);
  return (
    <View style={[styles.container, { justifyContent: "space-around" }]}>
      <TouchableOpacity
        onLongPress={() => {
          if (svg) {
            svg.toDataURL((data) => {
              Clipboard.setImageAsync(data);
            });
          }
        }}
      >
        <QRCode
          style={styles.qrCode}
          value={wallet.mnemonic ? wallet.mnemonic : wallet.privateKey}
          logo={Images.id.logoDarkTransparent}
          logoBackgroundColor="white"
          logoSize={50}
          size={250}
          onError={onError}
          getRef={(data) => setSvg(data)}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onLongPress={() => Clipboard.setStringAsync(wallet.mnemonic)}
      >
        <Text>{wallet.mnemonic}</Text>
      </TouchableOpacity>
      <Button
        title="Done" // TODO: i18n
        style={styles.button}
        onPress={onDone}
      />
    </View>
  );
}

export default function Profile({ navigation }) {
  const dispatch = useAppDispatch();
  const refreshToken = useAuthSelector(selectRefreshToken);

  const [qrCodeScannerVisible, setQrCodeScannerVisible] = useState(false);
  const [privateKeyDetailsVisible, setPrivateKeyDetailsVisible] =
    useState(false);

  const wallet = getWallet();

  return (
    <View style={styles.container}>
      <View>
        <Modal visible={qrCodeScannerVisible}>
          <QRCodeScanner
            onScanResult={async (type, data) => {
              await recoverWallet(dispatch, data);
              setQrCodeScannerVisible(!qrCodeScannerVisible);
            }}
          />
        </Modal>
      </View>
      <View>
        <Modal visible={privateKeyDetailsVisible}>
          <PrivateKeyDetails
            wallet={wallet}
            onDone={() => setPrivateKeyDetailsVisible(false)}
          />
        </Modal>
      </View>
      <Button
        title="Backup private key" // TODO: i18n
        style={styles.button}
        disabled={wallet == null}
        onPress={async () => setPrivateKeyDetailsVisible(true)}
      />
      <Button
        title="Recover private key" // TODO: i18n
        style={styles.button}
        onPress={async () => setQrCodeScannerVisible(true)}
      />
      <Button
        title="Sign out" // TODO: i18n
        style={styles.button}
        onPress={async () => doSignOut(refreshToken, dispatch, navigation)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: "80%",
    marginBottom: "5%",
  },
  button: {
    width: "80%",
    marginBottom: "5%",
  },
  card: {
    marginBottom: "20%",
  },
  qrCode: {},
  text: {
    fontWeight: "bold",
  },
});
