const path = require('path');
const webpack = require('webpack');

module.exports = {
    context: path.resolve(__dirname, './src'),
    entry: {
        app: './index.js',
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'bundle.js',
    },
    devServer: {
        inline: true,
        contentBase: './dist',
        port: 8081
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            }
        ]
    }
};