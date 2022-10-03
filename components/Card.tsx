import {
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

import { View, Text } from "./Themed";

type Props = {
  title: string;
  icon: string;
};

export type CardProps = Props & TouchableOpacityProps;

export function Card(props: CardProps) {
  return (
    <TouchableOpacity {...props} style={[props.style, styles.card]}>
      <Image source={props.icon} resizeMode="center" />
      <Text>{props.title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
  },
});
