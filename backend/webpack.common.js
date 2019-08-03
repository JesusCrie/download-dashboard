const path = require('path');
const nodeExternals = require('webpack-node-externals');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
    entry: {
        main: './src/main.ts'
    },
    target: 'node',
    externals: [nodeExternals()],
    node: {
        __dirname: false,
        __filename: false
    },
    plugins: [
        new CleanWebpackPlugin()
    ],
    module: {
        rules: [
            // Screw ts checking, let the IDE handle it
            {
                test: /\.[jt]s$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js', '.mjs']
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, 'dist')
    }
};
