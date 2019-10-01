import webpack from 'webpack';
import AssetsPlugin from 'assets-webpack-plugin';

const config = {
    entry: {
        app: __dirname + '/assets/app/jsx/index.jsx'
    },
    output: {
        path: __dirname + '/public/build',
        publicPath: '/build/',
        filename: '[name]-[chunkhash].bundle.js'
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
        new AssetsPlugin({
            path: __dirname + '/assets',
            fullPath: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'commonChunk'
        }),
        new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            minimize: true,
            compress: {
                warnings: false,
                drop_debugger: true,
                conditionals: true,
                loops: true,
                unused: true,
                hoist_funs: true,
                join_vars: true,
                drop_console: true
            },
            mangle: {
                screw_ie8: true
            },
            comments: false
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        })
    ]
};

export default config;
