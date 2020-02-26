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
			if (stats.isFile() && fPath.indexOf(".js") > 0) {
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
// let filesJs = findFilePathAndName('./src/htmljs')
let filesHtml = findFilePathAndName('./src/html')
module.exports = {
	// 构建webpack入口
	entryList: () => {
		let entryList = {};
		filesHtml.names.map((v, i, arr) => {
			// console.log(path.resolve(filesHtml.paths[i]))
			let url = filesHtml.paths[i].split("src")[1].split(".")[0]
			// url = url.substr(0, url.lastIndexOf('\\'))
			entryList[v] = path.resolve(filesHtml.paths[i])
		});
		return entryList;
	},
	// 使用html-webpack-plugin生成多个html页面
	htmlPluginList: () => {
		const pageList = []
		filesHtml.names.map((v, i, arr) => {
			pageList.push(
				new HtmlWebpackPlugin({
					filename: path.resolve(filesHtml.paths[i]).replace(/src/, 'dist').split(".")[0] + '.html',
					template: path.resolve(filesHtml.paths[i]).replace(/\.js/, '.html'),
					chunks: ['common', 'jquery', 'bootstrap', v],
					inject: 'body', // js的script注入到body底部
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