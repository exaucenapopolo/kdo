const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// Monorepo: watch entire workspace
config.watchFolders = [monorepoRoot];

// Resolve from both local and root node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
];

// pnpm stores packages at:
//   node_modules/.pnpm/<PKG>@<VERSION>_hash/node_modules/<PKG>/file.js
// On utilise expo.* et @expo.* pour inclure expo-file-system et tous les autres modules Expo.
const PACKAGES_TO_TRANSFORM = [
  "react-native",
  "@react-native",
  "expo.*",
  "@expo.*",
  "@react-navigation",
  "@unimodules",
].join("|");

config.resolver.transformIgnorePatterns = [
  `node_modules/(?!(.pnpm/[^/]+/node_modules/)?(${PACKAGES_TO_TRANSFORM})/)`,
];

module.exports = config;
