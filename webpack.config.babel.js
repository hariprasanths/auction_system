import webpack from 'webpack';
import AssetsPlugin from 'assets-webpack-plugin';

const config = {
    entry: {
        app: __dirname + '/assets/app/jsx/index.jsx'
    },
    output: {
        path: __dirname + '/public/build',
        publicPath: 'http://localhost:8080/build/',
        filename: '[name].js'
    },
    resolve: {
        extensions: ['*', '.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.ProvidePlugin({
            $: 'jquery'
        })
    ]
};

export default config;
