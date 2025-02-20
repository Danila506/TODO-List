const path = require("path");

module.exports = {
    devServer: {
        static: {
            directory: path.join(__dirname, "src"),
        },
        hot: true,
        liveReload: true,
        port: 3000,
    },
    entry: "./src/script.js",
    module: {
        rules: [
            { test: /\.svg$/, use: "svg-inline-loader" },
            { test: /\.css$/, use: ["style-loader", "css-loader"] },
        ],
    },
    mode: process.env.NODE_ENV === "production" ? "production" : "development",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
    },
};
