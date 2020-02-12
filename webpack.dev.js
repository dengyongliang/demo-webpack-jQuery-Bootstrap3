const merge = require('webpack-merge')
const common = require('./webpack.common')

module.exports = merge(common, {
    // 动态监测实时更新页面
    devServer: {
        contentBase: './dist',
        // 默认 8080， 可不写
        port: 8080,
        // 热更新，无需刷新
        hot: true
    }
})