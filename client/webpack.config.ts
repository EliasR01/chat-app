import path from "path";
import webpack from "webpack";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import SpeedMeasurePlugin from "speed-measure-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";

const smp = new SpeedMeasurePlugin();

const config: webpack.Configuration = smp.wrap({
  mode: "development",
  entry: "./src/index.tsx",
  target: "node",
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        include: path.resolve(__dirname, "src"),
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            exclude: /node_modules/,
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript",
            ],
          },
        },
      },
    ],
  },
  performance: {
    hints: process.env.NODE_ENV === "production" ? "warning" : false,
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  devtool: "inline-source-map",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "bundle.js",
    publicPath: "/",
  },
  // watch: true,
  // watchOptions: {
  //   ignored: ["node_modules/**"],
  // },
  devServer: {
    historyApiFallback: true,
    contentBase: path.join(__dirname, "build"),
    compress: true,
    port: 8000,
  },
  // optimization: {
  //   splitChunks: {
  //     cacheGroups: {
  //       commons: {
  //         test: /[\\/]node_modules[\\/]/,
  //         name: "vendors",
  //         chunks: "all",
  //       },
  //     },
  //   },
  // },

  plugins: [
    new CleanWebpackPlugin({
      // cleanStaleWebpackAssets: false
      verbose: true,
      dry: false,
      cleanOnceBeforeBuildPatterns: ["!index.html"],
    }),

    new ForkTsCheckerWebpackPlugin({
      async: false,
      eslint: {
        files: "./src/**/*",
      },
    }),
  ],
});

export default config;
