const fs = require("fs");
const path = require("path");

const getEnvFile = () => {
  try {
    fs.statSync(path.resolve(__dirname, "./.env"));
    return path.resolve(__dirname, "./.env");
  } catch (err) {
    return path.resolve(__dirname, "./.env.sample");
  }
};

const getConfig = env => {
  const plugins = [
    "@babel/plugin-proposal-class-properties",

    [
      "babel-plugin-inline-import",
      {
        extensions: [".glsl"]
      }
    ],

    [
      "babel-plugin-inline-dotenv",
      {
        path: getEnvFile(),
        systemVar: "overwrite",
        env:
          (env === "test" && { GIST_ID: "3b267cd582f17544bdd923d9e75b8223" }) ||
          {}
      }
    ],

    "@babel/plugin-syntax-dynamic-import"
  ];

  const presets = [
    "@emotion/babel-preset-css-prop",

    "@babel/preset-typescript",

    "@babel/preset-react"
  ];

  if (env === "test") {
    plugins.push("@babel/plugin-transform-modules-commonjs");
  }

  if (env === "production") {
    presets.push([
      "@babel/preset-env",
      {
        targets: {
          firefox: "70",
          chrome: "79",
          edge: "18",
          safari: "13",
          ios: "13"
          // ie: '11',
        },
        useBuiltIns: false,
        modules: false
      }
    ]);
  }

  return { plugins, presets };
};

module.exports = api => getConfig(api.env());

module.exports.getConfig = getConfig;
