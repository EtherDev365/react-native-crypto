import { FontAwesome } from "@expo/vector-icons";
import * as Font from "expo-font";

import { preloadImages } from "../utils/images";

async function loadFonts(): Promise<void> {
  return Font.loadAsync({
    ...FontAwesome.font,
    "space-mono": require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
}

export default function waitForCachedResources() {
  return Promise.all([preloadImages(), loadFonts()]);
}
