const path = require("path");
const ManifestPlugin = require("webpack-manifest-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const RobotstxtPlugin = require("robotstxt-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const CopyPlugin = require("copy-webpack-plugin");

// @ts-ignore
const pkg = require("../../package.json");

const meta = {
  title: pkg.name,
  author: pkg.author,
  url: pkg.homepage,
  description: pkg.description
};

{
  const m = meta.description.match(/^__(.+)__(.*)$/);
  if (m) {
    meta.description = m[2];
    meta.title = m[1];
  }
}

const createConfig = mode => ({
  mode,
  entry: {
    main: path.resolve(__dirname, "../index.tsx")
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  output: {
    filename: "[name].[contenthash].js",
    chunkFilename: "[name].[contenthash].js",
    path: path.resolve(__dirname, "../.build"),
    publicPath: process.env.PUBLIC_PATH || "/"
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.(js)|(tsx?)$/,
        loader: "babel-loader",
        options: { rootMode: "upward" }
      },
      {
        test: /\.(ttf|otf)$/i,
        loader: "file-loader"
      }
    ]
  },

  plugins: [
    mode === "production" && new CleanWebpackPlugin(),

    mode === "production" &&
      new RobotstxtPlugin({
        policy: [
          {
            userAgent: "*",
            allow: "/",
            crawlDelay: 10
          }
        ]
      }),

    new HtmlWebpackPlugin({
      template: path.join(__dirname, "../index.html"),
      filename: "index.html",
      title: meta.title,
      hash: true,
      meta: {
        viewport: "width=device-width, initial-scale=1, shrink-to-fit=no"
      },
      templateParameters: ({ assets, ...o }) => {
        const fontAsset =
          o.outputOptions.publicPath +
          Object.keys(assets).find(a => a.endsWith(".otf"));

        return { ...meta, publicPath: o.outputOptions.publicPath, fontAsset };
      },
      minify: mode === "production" && {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      }
    }),

    mode === "production" &&
      new ManifestPlugin({
        fileName: "assets-manifest.json"
      }),

    mode === "production" &&
      new BundleAnalyzerPlugin({
        openAnalyzer: false,
        generateStatsFile: true,
        reportFilename: "bundle-analyzer-report.html",
        analyzerMode: "static"
      }),

    mode === "production" &&
      new CopyPlugin([
        {
          from: path.resolve(__dirname, "../assets/favicon"),
          to: path.resolve(__dirname, "../.build")
        },
        {
          from: path.resolve(__dirname, "../assets/images"),
          to: path.resolve(__dirname, "../.build")
        }
      ])
  ].filter(Boolean),

  devtool: false,
  // devtool: mode === "production" ? "source-map" : false,

  devServer: {
    stats: "errors-only"
  }
});

module.exports = createConfig(process.env.NODE_ENV || "development");
