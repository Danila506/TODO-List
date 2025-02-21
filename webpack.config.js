const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html", // Указываем путь к вашему HTML-шаблону
        }),
        new MiniCssExtractPlugin({
            filename: "output.css", // Имя выходного CSS-файла
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "src/favicon.ico"), // Копируем favicon.ico
                    to: path.resolve(__dirname, "dist"),
                },
            ],
        }),
    ],
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
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader, // Извлекает CSS в отдельный файл
                    "css-loader", // Обрабатывает CSS
                ],
            },
        ],
    },
    mode: process.env.NODE_ENV === "production" ? "production" : "development",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
    },
};
