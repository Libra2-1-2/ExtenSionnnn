/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
module.exports = {
	webpack: {
		configure: (webpackConfig, { env, paths }) => {
			return {
				...webpackConfig,
				entry: {
					main: [
						env === "development" &&
							require.resolve(
								"react-dev-utils/webpackHotDevClient"
							),
						paths.appIndexJs,
					].filter(Boolean),
					content: paths.appSrc + "/bg_scripts/background.ts",
				},
				output: {
					...webpackConfig.output,
					filename: "static/js/[name].js",
				},
				optimization: {
					...webpackConfig.optimization,
					runtimeChunk: false,
				},
				plugins: [
					...webpackConfig.plugins,
					new HtmlWebpackPlugin({
						inject: true,
						chunks: ["options"],
						template: paths.appHtml,
						filename: "options.html",
					}),
					new CopyPlugin({
						patterns: [
							{
								from: "public/img/icon_16.png",
								to: "static/js/",
							},
							{
								from: "public/img/icon_48.png",
								to: "static/js/",
							},
							{
								from: "public/img/icon_32.png",
								to: "static/js/",
							},
							{
								from: "public/img/icon_128.png",
								to: "static/js/",
							},
						],
					}),
				],
			};
		},
	},
};
