const webpack = require("webpack")
const path = require('path')

module.exports = {
	target: "webworker",
	entry: "./src/index.js", // inferred from "main" in package.json
	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
		plugins: []
	},
	output: {
		path: __dirname + "/dist",
		publicPath: "dist",
		filename: "worker.js"
	}
}