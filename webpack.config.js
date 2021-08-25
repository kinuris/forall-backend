const path = require('path')
const nodeExternals = require("webpack-node-externals")

module.exports = {
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist', 'bundled'),
        filename: 'index.bundle.js'
    },
    mode: 'development',
    target: 'node',
    resolve: {
        extensions: [ '.ts', '.tsx', ".js", ".json"]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: "ts-loader"
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
                options: {
                    minimize: true
                }
            }
        ]
    },
    externals: [nodeExternals()]
}