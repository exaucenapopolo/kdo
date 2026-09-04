module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Si vous utilisez react-native-reanimated, il doit TOUJOURS être le dernier plugin :
      'react-native-reanimated/plugin',
    ],
  };
};
