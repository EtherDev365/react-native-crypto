import { Asset } from "expo-asset";

const images = {
  account: require("../assets/images/account.png"),
  accountSelected: require("../assets/images/account-selected.png"),
  adaptiveIcon: require("../assets/images/adaptive-icon.png"),
  add: require("../assets/images/add.png"),
  arrowDown: require("../assets/images/arrow-down.png"),
  arrowUp: require("../assets/images/arrow-up.png"),
  bulb: require("../assets/images/bulb.png"),
  carDisconnect: require("../assets/images/car-disconnect.png"),
  cardsBold: require("../assets/images/cards-bold.png"),
  cards: require("../assets/images/cards.png"),
  cardsSelected: require("../assets/images/cards-selected.png"),
  cardTick: require("../assets/images/card-tick.png"),
  car: require("../assets/images/car.png"),
  fail: require("../assets/images/fail.png"),
  favicon: require("../assets/images/favicon.png"),
  home: require("../assets/images/home.png"),
  homeSelected: require("../assets/images/home-selected.png"),
  icon: require("../assets/images/icon.png"),
  infoCircle: require("../assets/images/info-circle.png"),
  location: require("../assets/images/location.png"),
  logo: require("../assets/images/logo.png"),
  logoBlue: require("../assets/images/logo_blue.png"),
  logoDark: require("../assets/images/logo_dark.png"),
  logoLightTransparent: require("../assets/images/logo_light_transparent.png"),
  logoDarkTransparent: require("../assets/images/logo_dark_transparent.png"),
  map: require("../assets/images/map.png"),
  moneyReceive: require("../assets/images/money-receive.png"),
  notification: require("../assets/images/notification.png"),
  profile: require("../assets/images/profile.png"),
  qrcodePayment: require("../assets/images/qrcode-payment.png"),
  qrcode: require("../assets/images/qrcode.png"),
  scan: require("../assets/images/scan.png"),
  settings: require("../assets/images/setting.png"),
  settingsSelected: require("../assets/images/setting-selected.png"),
  splash: require("../assets/images/splash.png"),
  station: require("../assets/images/station.png"),
  success: require("../assets/images/success.png"),
  wallet: require("../assets/images/wallet.png"),
  xcfBuy: require("../assets/images/xcf_buy.png"),
  xcfPurchase: require("../assets/images/xcf_purchase.png"),
};

export async function preloadImages() {
  return Asset.loadAsync(Object.keys(images).map((id) => images[id]));
}

export default {
  id: images,
};
