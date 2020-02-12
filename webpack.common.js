const path = require('path')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')

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
            chunks: ['common', 'jquery', 'index']
        }),
        new HtmlWebpackPlugin({
            filename: 'login.html',
            template: './src/html/login.html',
            chunks: ['common', 'jquery', 'login']
        }),
        new CopyWebpackPlugin([
            {
                from: './src/static',
                to: 'static'
            }
        ]),
        new webpack.ProvidePlugin({
            $: 'jquery-1x',
            jQuery: 'jquery-1x'
        }),
        // 分离样式到css文件
        new MiniCssExtractPlugin({
            filename: 'css/[name].css'
        })
    ],
    // 编译输出路径
    output: {
        // js生成到dist/js，[name]表示保留原js文件名
        filename: 'js/[name].js',
        // 输出路径为dist
        path: path.resolve(__dirname, 'dist')
    },
    optimization: {
        splitChunks: {
            cacheGroups:{
                // 提取公共jquery文件
                commons: {
                    test: /jquery/,
                    name: 'jquery',
                    chunks: 'all'
                },
                // 提取公共css文件
                styles: {
                    test: /[\\/]common[\\/].+\.css$/,
                    name: 'common',
                    chunks: 'all',
                    enforce: true
                }
            }
        },
        // 解决IE8“缺少标识符”错误
        minimizer: [
            new UglifyJsPlugin({
                uglifyOptions: {
                    ie8: true
                }
            })
        ]
    },
    module: {
        rules: [
            // 解决ES6转ES5
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: [
                            '@babel/plugin-transform-runtime',
                            '@babel/plugin-transform-modules-commonjs'
                        ]
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    {
                        // 将原来的style-loader替换
                        loader: MiniCssExtractPlugin.loader,
                        // 'style-loader',
                        options: {
                            // css中的图片路径增加前缀
                            publicPath: '../'
                        }
                        
                    },
                    'css-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif|webp)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            // 最终生成的css代码中,图片url前缀
                            // publicPath: '../images',
                            // 图片输出的实际路径(相对于dist)
                            outputPath: 'images',
                            // 当小于某KB时转为base64
                            limit: 0,
                            esModule: false
                        }
                    }
                ]
            },
            {
                test: /\.(html)$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        attrs: ['img:src', 'img:data-src', 'audio:src'],
                        minimize: true
                    }
                }
            }
        ]
    }
}