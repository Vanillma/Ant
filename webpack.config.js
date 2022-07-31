const path = require("path");

const fs = require("fs");

const webpack = require("webpack");

const WebpackBar = require("webpackbar");

const HtmlWebpackPlugin = require("html-webpack-plugin");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");

// Look for .html files
let htmlFiles = [];
let directories = ["src"];
while (directories.length > 0) {
  let directory = directories.pop();
  let dirContents = fs
    .readdirSync(directory)
    .map((file) => path.join(directory, file));

  htmlFiles.push(...dirContents.filter((file) => file.endsWith(".html")));
  directories.push(
    ...dirContents.filter((file) => fs.statSync(file).isDirectory())
  );
}

module.exports = {
  devServer: {
    static: {
      directory: path.join(__dirname, "./dist"),
    },
    compress: true,
    historyApiFallback: true,
    https: false,
    open: true,
    hot: true,
    port: 9002,
    proxy: {
      "/api": "http://localhost:9000",
    },
    devMiddleware: {
      writeToDisk: true,
    },
  },
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].[contenthash].js",
  },

  plugins: [
    new CleanWebpackPlugin(),
    new WebpackBar(),

    new HtmlWebpackPlugin({
      template: "./src/index.html",
      hash: true,
      filename: "index.html",
      inject: "head",
      scriptLoading: "defer",
      xhtml: true,
    }),
  ],

  module: {
    rules: [
      //-------> CSS <-------//
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
        generator: {
          filename: "assets/styles/[name].[contenthash] [ext]",
        },
      },

      //-------> HTML <-------//
      {
        test: /\.html$/i,
        loader: "html-loader",
      },

      //-------> Images <-------//
      {
        test: /\.(png|jpe?g|gif)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/images/[name].[hash][ext]",
        },
      },

      //-------> Fonts <-------//
      {
        test: /\.(woff(2)?|ttf|eot)$/,
        type: "asset/resource",
        generator: {
          filename: "./assets/fonts/[name].[contenthash][ext]",
        },
      },
    ],
  },
};
