const path = require("path");
require("@babel/polyfill");
// const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    // devServer: {
    //     stats: {
    //         children: false,
    //         maxModules: 0,
    //     },
    //     port: 3001,
    // },
    entry: {
        // "js/svg/svgLib": path.resolve(__dirname, "src/js/svg/svgLib.js"),
        // "js/autoResize": path.resolve(__dirname, "src/js/autoResize.js"),
        // "js/math/mathLib": path.resolve(__dirname, "src/js/math/mathLib.js"),
        // "js/math/shape3DX": path.resolve(__dirname, "src/js/math/shape3DX.js"),
        // "js/math/shape3D": path.resolve(__dirname, "src/js/math/shape3D.js"),
        // "js/math/point3D": path.resolve(__dirname, "src/js/math/point3D.js"),
        // "js/math/point2D": path.resolve(__dirname, "src/js/math/point2D.js"),
        // "js/const": path.resolve(__dirname, "src/js/const.js"),
        // "js/draw": path.resolve(__dirname, "src/js/draw.js"),
        // "js/utils": path.resolve(__dirname, "src/js/utils.js"),
        "js/draw": [path.resolve(__dirname, "CONTENT_01/js/draw.js")],
    },
    watch: true,
    mode: "development",
    output: {
        path: __dirname,
        filename: "[name].bundle.js",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    // plugins: [
    //     new HtmlWebpackPlugin({
    //         template: path.resolve(__dirname, "index.html"),
    //     }),
    // ],
};
