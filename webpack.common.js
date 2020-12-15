const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: {
	ttt: './src/index.js',
    },
    plugins: [
	// new CleanWebpackPlugin(['build/*']) for < v2 versions of CleanWebpackPlugin
	new CleanWebpackPlugin(),
	new HtmlWebpackPlugin({
            hash: false,
	    template: './src/index.html',
            filename: 'index.html'
        }),
	new CopyPlugin({
	    patterns: [
		"public"
	    ]}),

	new InjectManifest({
	    swSrc: './src/service-worker.js',
	    swDest: 'service-worker.js',
	    // Any other config if needed.
	}),
    ],
    output: {
	filename: '[name].bundle.js',
	path: path.resolve(__dirname, 'build'),
    },
    module:{
        rules:[
            {
                test:/\.css$/,
                use:['style-loader','css-loader']
            }
	]
    },
};
