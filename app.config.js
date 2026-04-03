const { expo } = require("./app.json");

const googleMapsApiKey = process.env.EXPO_GOOGLE_MAPS_API_KEY;

module.exports = {
  ...expo,
  extra: {
    ...expo.extra,
    googleMapsApiKey,
  },
  android: {
    ...expo.android,
    config: {
      ...expo.android?.config,
      googleMaps: {
        ...(expo.android?.config?.googleMaps ?? {}),
        apiKey: googleMapsApiKey ?? expo.android?.config?.googleMaps?.apiKey,
      },
    },
  },
  ios: {
    ...expo.ios,
    config: {
      ...expo.ios?.config,
      googleMapsApiKey:
        googleMapsApiKey ?? expo.ios?.config?.googleMapsApiKey,
    },
  },
};
