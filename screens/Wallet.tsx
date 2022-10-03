import { StyleSheet, TouchableOpacity } from "react-native";
import QRCode from "react-native-qrcode-svg";
import * as Clipboard from "expo-clipboard";

import { View, Text } from "../components/Themed";
import { selectSignerAddress, useSignerSelector } from "../hooks/signer";

import Images from "../utils/images";
import { useState } from "react";

function onError(err) {
  console.error("Failed to generate qrcode: ", err);
}

export default function Wallet() {
  const address = useSignerSelector(selectSignerAddress);
  const [svg, setSvg] = useState(null);

  if (!address) {
    return (
      <View style={styles.container}>
        <Text>Signer not yet initialized.</Text>
      </View>
    );
  }

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
          value={address}
          logo={Images.id.logoDarkTransparent}
          logoBackgroundColor="white"
          logoSize={50}
          size={250}
          onError={onError}
          getRef={(svg) => setSvg(svg)}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onLongPress={async () => {
          await Clipboard.setStringAsync(address);
        }}
      >
        <Text style={styles.address}>{address}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  qrCode: {},
  address: {
    marginTop: "10%",
    fontWeight: "bold",
  },
});
