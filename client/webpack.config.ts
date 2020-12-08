import path from "path";
import webpack from "webpack";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import SpeedMeasurePlugin from "speed-measure-webpack-plugin";

const smp = new SpeedMeasurePlugin();

const config: webpack.Configuration = smp.wrap({
  entry: "./src/index.tsx",
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
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
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "bundle.js",
    publicPath: "/",
  },
  devServer: {
    historyApiFallback: true,
    contentBase: path.join(__dirname, "build"),
    compress: true,
    port: 8000,
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      async: false,
      eslint: {
        files: "./src/**/*",
      },
    }),
  ],
});

export default config;
