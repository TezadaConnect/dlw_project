// Learn more https://docs.expo.io/guides/customizing-metro
// const { getDefaultConfig } = require("@expo/metro-config");

// module.exports = getDefaultConfig(__dirname);

// const { getDefaultConfig } = require("@expo/metro-config");

// const defaultConfig = getDefaultConfig(__dirname);

// defaultConfig.resolver.assetExts.push("cjs");

// module.exports = defaultConfig;

// const { getDefaultConfig } = require("@expo/metro-config");

// const config = getDefaultConfig(__dirname);

// config.resolver.resolverMainFields.unshift("react-native");

// module.exports = config;

const { getDefaultConfig } = require("@expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.resolverMainFields.unshift("react-native");

defaultConfig.resolver.assetExts.push("cjs");

module.exports = defaultConfig;
