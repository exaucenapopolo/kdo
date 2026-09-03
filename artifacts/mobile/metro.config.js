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
// The optional (.pnpm/[^/]+/node_modules/)? prefix handles this double-nesting
// so that react-native, expo, etc. are always Babel-transformed.
// This is required because hermesc (Linux LLVM 8.0.0) bundled with react-native 0.81
// does NOT support ES2022 private class fields (#x, #y, #width, #height) used in
// react-native/src/private/webapis/geometry/DOMRectReadOnly.js and DOMRect.js.
const PACKAGES_TO_TRANSFORM = [
  "react-native",
  "@react-native",
  "expo",
  "@expo",
  "expo-router",
  "expo-updates",
  "expo-modules-core",
  "expo-constants",
  "expo-font",
  "expo-web-browser",
  "@react-navigation",
  "@unimodules",
].join("|");

config.resolver.transformIgnorePatterns = [
  `node_modules/(?!(.pnpm/[^/]+/node_modules/)?(${PACKAGES_TO_TRANSFORM})/)`,
];

module.exports = config;
