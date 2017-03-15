let join = require('path').join;
module.exports = {
	// start w/ app-client.js bc it includes / requires APP.js
	entry: "./app-client.js",
	output: {
		// file to create
        path: join(__dirname,'/public'),
		filename: "/bundle.js",
        publicPath: './public/'
	},
	module: {
		loaders: [
			{
				// do not bundle the "node_modules" folder or the app-server.js file
				exclude: /(node_modules|app-server.js)/,
				// load the files using Babel (to concert from ES6 + JSX -> ES5)
				loader: 'babel'
			}
		]
	}
};