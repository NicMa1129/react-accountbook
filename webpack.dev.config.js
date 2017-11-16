let babelpolyfill = require("babel-polyfill")
let webpack = require('webpack')
let path = require('path')
let HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        app: [
            'webpack-dev-server/client?http://0.0.0.0:8888',//资源服务器地址
            'webpack/hot/only-dev-server',
            './src/index.js'
        ],
        vendor: ['react', 'react-dom', 'react-router',]
    },
    // devtool: 'source-map',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: "[name].js",
        publicPath: "/",
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
    devServer:{
        contentBase: './src/',
        historyApiFallback:true,
        hot:true,
        inline:true,
        // progress:true,//报错无法识别，删除后也能正常刷新
        port: 8888,
        noInfo: false
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

            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src/index.html'),
            inject:'true',
            chunks: ['vendor', 'app'],
            minify:{ //压缩HTML文件
                removeComments:true,    //移除HTML中的注释
                collapseWhitespace:true    //删除空白符与换行符
            }
        })
    ]
}