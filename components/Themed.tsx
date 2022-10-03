/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import {
  Text as DefaultText,
  TextInput as DefaultTextInput,
  TouchableOpacity,
  View as DefaultView,
} from "react-native";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme();
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

type ButtonTypeProps = {
  color?: "primary" | "secondary";
};

export type ButtonProps = ThemeProps &
  ButtonTypeProps & { title: string } & TouchableOpacity["props"];
export type TextProps = ThemeProps & DefaultText["props"];
export type TextInputProps = ThemeProps & DefaultTextInput["props"];
export type ViewProps = ThemeProps & DefaultView["props"];

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function TextInput(props: TextInputProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const placeholderTextColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "placeholderTextColor"
  );
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "inputBackgroundColor"
  );

  return (
    <DefaultTextInput
      style={[{ color, backgroundColor, borderRadius: 10, padding: 10 }, style]}
      placeholderTextColor={placeholderTextColor}
      {...otherProps}
    />
  );
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function Button(props: ButtonProps) {
  const { style, lightColor, darkColor, title, ...otherProps } = props;

  const color = props.color ? props.color : "primary";

  const backgroundColor =
    color == "secondary"
      ? useThemeColor(
          { light: lightColor, dark: darkColor },
          "secondaryButtonBackground"
        )
      : useThemeColor(
          { light: lightColor, dark: darkColor },
          "primaryButtonBackground"
        );

  const textColor =
    color == "secondary"
      ? useThemeColor(
          { light: lightColor, dark: darkColor },
          "secondaryButtonText"
        )
      : useThemeColor(
          { light: lightColor, dark: darkColor },
          "primaryButtonText"
        );

  const borderColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "buttonBorderColor"
  );

  return (
    <TouchableOpacity
      style={[
        {
          backgroundColor,
          borderColor,
          borderWidth: 2,
          borderRadius: 10,
          padding: 10,
          alignItems: "center",
        },
        style,
      ]}
      {...otherProps}
    >
      <Text
        style={[
          {
            color: textColor,
            fontWeight: "bold",
          },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
