const path = require('path');

module.exports = {
    entry: ["@babel/polyfill", __dirname + '/src/forBuild.js'],
    devtool: 'source-map',
    output: {
        path: __dirname + '/dist',
        filename: 'gup.js',
        library: 'gup',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    devServer: {
        historyApiFallback: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ['babel-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loader: 'style-loader'
            }, {
                test: /\.css$/,
                loader: 'css-loader',
                query: {
                    modules: true,
                    localIdentName: '[name]__[local]___[hash:base64:5]'
                }
            }
        ]
    }
};