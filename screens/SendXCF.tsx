import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { BarCodeScanner, PermissionStatus } from "expo-barcode-scanner";
import QRCode from "react-native-qrcode-svg";
import * as Clipboard from "expo-clipboard";

import axios from "axios";

import { Button, Text, TextInput, View } from "../components/Themed";

import { Card } from "../components/Card";

import Images from "../utils/images";

import { selectAccessToken, useAuthSelector } from "../hooks/authenticator";

import { getSigner } from "../hooks/signer";
import { Signer } from "ethers";

const baseUrl = "https://api.proto.cenfura.io";

async function getTransferTransaction(
  accessToken: string,
  signer: Signer,
  toAddress: string,
  amount: string
) {
  const fromAddress = await signer.getAddress();
  return axios({
    method: "get",
    url: `${baseUrl}/tx/xcf/transfer?from=${fromAddress}&to=${toAddress}&amount=${amount}&unit=ether`,
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((response) => {
    console.log("Get transfer tx data response:", response.data);
    return response.data;
  });
}

async function signTransaction(signer: Signer, data) {
  const signedData = await signer.signTransaction(data);
  return signedData;
}

async function sendSignedTransaction(accessToken: string, data: string) {
  return axios({
    method: "post",
    url: `${baseUrl}/tx/signed`,
    headers: {
      "Content-type": "text/plain",
      Authorization: `Bearer ${accessToken}`,
    },
    data,
  }).then((response) => {
    console.log("Send signed tx response:", response.data);
    return response.data;
  });
}

async function doTransfer(accessToken, signer, address, amount) {
  const tx = await getTransferTransaction(accessToken, signer, address, amount);
  const signedTx = await signTransaction(signer, tx);
  const response = await sendSignedTransaction(accessToken, signedTx);
  console.log("response: ", response);
  return response.hash;
}

function QRCodeScanner({ onScanResult }) {
  const [hasPermission, setHasPermission] = useState(null);

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

function TransactionInfo({ transactionId, onDone }) {
  const [svg, setSvg] = useState(null);

  const onError = (err) => {
    console.error("Failed to create QR code for transction ID", err);
  };

  return (
    <View style={styles.container}>
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
          value={transactionId}
          logo={Images.id.logoDarkTransparent}
          logoBackgroundColor="white"
          logoSize={50}
          size={250}
          onError={onError}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onLongPress={async () => {
          await Clipboard.setStringAsync(transactionId);
        }}
      >
        <Text style={styles.text}>{transactionId}</Text>
      </TouchableOpacity>
      <Button
        title="Done" // TODO: i18n
        style={styles.button}
        onPress={onDone}
      />
    </View>
  );
}

export default function SendXCF({ navigation }) {
  const [qrScannerVisible, setQrScannerVisible] = useState(false);
  const [txInfoVisible, setTxInfoVisible] = useState(false);
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);
  const [tx, setTx] = useState("");

  const accessToken = useAuthSelector(selectAccessToken);
  const signer = getSigner();

  if (busy) {
    return <ActivityIndicator color={"#fff"} />;
  }

  return (
    <View style={styles.container}>
      <View>
        <Modal visible={qrScannerVisible}>
          <QRCodeScanner
            onScanResult={(type, data) => {
              setAddress(data);
              setQrScannerVisible(!qrScannerVisible);
            }}
          />
        </Modal>
      </View>
      <View>
        <Modal visible={txInfoVisible}>
          <TransactionInfo
            transactionId={tx}
            onDone={() => navigation.navigate("Root")}
          />
        </Modal>
      </View>
      <Card
        title="Scan address" // TODO: i18n
        icon={Images.id.qrcode}
        style={[styles.card, { backgroundColor: "#dcdcdc" }]}
        onPress={() => setQrScannerVisible(true)}
      />
      <TextInput
        placeholder="Address" //TODO: i18n
        value={address ? address : ""}
        style={styles.input}
        onChangeText={(address) => setAddress(address)}
      />
      <TextInput
        placeholder="Amount" //TODO: i18n
        value={amount ? amount : ""}
        style={styles.input}
        onChangeText={(amount) => setAmount(amount)}
      />
      <Button
        title="Send" // TODO: i18n
        style={styles.button}
        onPress={async () => {
          setBusy(true);
          const tx = await doTransfer(accessToken, signer, address, amount);
          setTx(tx);
          setTxInfoVisible(true);
          setBusy(false);
        }}
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
  },
  card: {
    marginBottom: "20%",
  },
  qrCode: {},
  text: {
    fontWeight: "bold",
  },
});
