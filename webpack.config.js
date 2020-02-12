const path = require('path')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    // 入口JS路径
    entry: {
        index: './src/js/index.js',
        login: './src/js/login.js'
    },
    plugins: [
        // 自动清空dist目录
        new CleanWebpackPlugin(),
        // 设置html模板生成路径
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/html/index.html',
            chunks: ['index']
        }),
        new HtmlWebpackPlugin({
            filename: 'login.html',
            template: './src/html/login.html',
            chunks: ['login']
        })
    ],
    // 编译输出路径
    output: {
        // js生成到dist/js，[name]表示保留原js文件名
        filename: 'js/[name].js',
        // 输出路径为dist
        path: path.resolve(__dirname, 'dist')
    },
    // 动态监测实时更新页面
    devServer: {
        contentBase: './dist',
        // 默认 8080， 可不写
        port: 8080,
        // 热更新，无需刷新
        hot: true
    },
    // 方便追踪源代码错误
    devtool: 'source-map'
}