let babelpolyfill = require("babel-polyfill")
let webpack = require('webpack')
let path = require('path')
let HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        app: [
            './src/index.js'
        ],
        vendor: ['react', 'react-dom', 'react-router', 'highcharts']
    },
    // devtool: 'source-map',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: "[name].js",
        publicPath: "/git/react-accountbook/dist/",
        // publicPath: "/",
        chunkFilename: "[name].[chunkhash:8].js"
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        // 定义引用路径的别名（路径简写）
        alias: {
            components: path.join(__dirname, '/src/components'),
            containers: path.join(__dirname, '/src/containers'),
            store: path.join(__dirname, '/src/redux/store'),
            reducer: path.join(__dirname, '/src/redux/reducer'),
            actions: path.join(__dirname, '/src/redux/action'),
            common: path.join(__dirname, '/src/common'),
            style: path.join(__dirname, '/src/static/style')
        }
    },
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                loader: ['react-hot-loader', 'babel-loader'],
                include: [path.join(__dirname, 'src')]
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader?importLoaders=1'
            },
            {
                test: /\.scss$/,
                loader: 'style-loader!css-loader!postcss-loader!sass-loader'
            },
            {
                test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
                loader: 'url-loader?limit=50000&name=[path][name].[ext]'
            },
            {
                test: /\.svg$/,
                loader: 'svg-url-loader?limit=8192!file-loader'
            },
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src/index.html'),
            inject:'true',
            chunks: ['vendor', 'app'],
            minify:{ //压缩HTML文件
                removeComments:true,    //移除HTML中的注释
                collapseWhitespace:true    //删除空白符与换行符
            }
        }),
        new webpack.optimize.UglifyJsPlugin({    //压缩代码
            output: {
                comments: false,  // remove all comments
            },
            compress: {
                warnings: false
            },
            except: ['$super', '$', 'exports', 'require']    //排除关键字
        }),
        new webpack.optimize.CommonsChunkPlugin('vendor'),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        })
    ]
}