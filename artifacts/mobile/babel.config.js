module.exports = function (api) {
  api.cache(true);
  return {
    presets: [["babel-preset-expo", { unstable_transformImportMeta: true }]],
    plugins: [
      // Force-transform private class fields before hermesc sees them.
      // The hermesc binary bundled with react-native on Linux (LLVM 8.0.0)
      // does not support private class fields (ES2022), but react-native 0.81+
      // ships DOMRect/DOMRectReadOnly with #x #y #width #height.
      ["@babel/plugin-transform-class-properties", { loose: true }],
      ["@babel/plugin-transform-private-methods", { loose: true }],
      ["@babel/plugin-transform-private-property-in-object", { loose: true }],
    ],
  };
};
