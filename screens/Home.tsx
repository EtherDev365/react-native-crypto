import { StyleSheet, Image } from "react-native";

import { View } from "../components/Themed";

import { Card } from "../components/Card";

import Images from "../utils/images";

function onReceiveXCF(navigation) {
  navigation.navigate("Wallet");
}

function onSendXCF(navigation) {
  navigation.navigate("SendXCF");
}

export default function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={Images.id.logo}
          style={styles.headerImage}
          resizeMode="center"
        />
      </View>
      <View style={styles.cardContainer}>
        <Card
          title="Receive XCF" // TODO: i18n
          icon={Images.id.arrowDown}
          style={[styles.card, { backgroundColor: "powderblue" }]}
          onPress={() => onReceiveXCF(navigation)}
        />
        <Card
          title="Send XCF" // TODO: i18n
          icon={Images.id.arrowUp}
          style={[styles.card, { backgroundColor: "powderblue" }]}
          onPress={() => onSendXCF(navigation)}
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
  cardContainer: {
    flex: 1,
    alignContent: "space-around",
    justifyContent: "space-evenly",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  card: {
    width: "40%",
    height: "40%",
  },
});
