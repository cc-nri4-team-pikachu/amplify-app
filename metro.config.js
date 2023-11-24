const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    blacklistRE: require('metro-config/src/defaults/exclusionList')([
      /#current-cloud-backend\/.*/,
      /node_modules[/\\]react[/\\]dist[/\\].*/,
      /website\/node_modules\/.*/,
      /heapCapture\/bundle\.js/,
      /.*\/__tests__\/.*/,
    ]),
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);

