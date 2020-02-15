const fs = require('fs')
const path = require('path')
const pathJoin = require('path').join
const HtmlWebpackPlugin = require('html-webpack-plugin')
/**
 * @param startPath  起始目录文件夹路径
 * @returns {Array}
 */
function findFilePathAndName(startPath) {
	let names = []
	let paths = []

	function findNext(path) {
		let files = fs.readdirSync(path);
		files.forEach((val, idx) => {
			let fPath = pathJoin(path, val);
			let stats = fs.statSync(fPath);

			if (stats.isDirectory() && val !== 'common') {
				findNext(fPath)
			}
			if (stats.isFile()) {
				paths.push(fPath)
				names.push(val.split(".")[0])
			}
		})
	}
	findNext(startPath)
	// console.log(paths)
	// console.log(names)
	return {
		names: names,
		paths: paths
	};
}
let filesJs = findFilePathAndName('./src/js')
let filesHtml = findFilePathAndName('./src/html')
module.exports = {
	// 构建webpack入口
	entryList: () => {
		const entryList = {};
		filesJs.names.map((v, i, arr) => {
			entryList[v] = path.resolve(filesJs.paths[i])
		});
		return entryList;
	},
	// 使用html-webpack-plugin生成多个html页面
	htmlPluginList: () => {
		const pageList = []
		filesHtml.names.map((v, i, arr) => {
			pageList.push(
				new HtmlWebpackPlugin({
					template: path.resolve(filesHtml.paths[i]),
					filename: path.resolve(filesHtml.paths[i]).replace(/src/, 'dist'),
					chunks: ['common', 'jquery', v],
					//压缩配置
					minify: {
						//删除Html注释
						removeComments: true,
						//去除空格
						collapseWhitespace: true,
						//去除属性引号
						removeAttributeQuotes: true
					},
					chunksSortMode: 'dependency'
				})
			)
		})
		return pageList
	}
}