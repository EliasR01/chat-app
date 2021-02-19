import path from "path";
import webpack from "webpack";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import SpeedMeasurePlugin from "speed-measure-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import dotenv from "dotenv";

const env = dotenv.config();

const smp = new SpeedMeasurePlugin();

const config: webpack.Configuration = smp.wrap({
  mode: "development",
  entry: "./src/index.tsx",
  target: "node",
  devtool: "inline-source-map",
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
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  performance: {
    hints: process.env.NODE_ENV === "production" ? "warning" : false,
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    path: path.resolve(__dirname, "/build"),
    publicPath: "/",
    filename: "bundle.js",
  },
  devServer: {
    historyApiFallback: true,
    contentBase: path.join(__dirname, "build"),
    compress: true,
    open: true,
    hot: true,
    port: 8000,
    clientLogLevel: "info",
    hotOnly: true,
  },

  plugins: [
    new CleanWebpackPlugin({
      verbose: true,
      dry: false,
      cleanOnceBeforeBuildPatterns: ["!index.html"],
    }),
    new webpack.EnvironmentPlugin(Object.keys(env.parsed || {})),
    new ForkTsCheckerWebpackPlugin({
      async: false,
      eslint: {
        files: "./src/**/*",
      },
    }),
  ],
});

export default config;
