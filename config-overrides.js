const webpack = require('webpack');
const { override } = require('customize-cra');

module.exports = override((config) => {
	// Filter environment variables with the custom prefix
	const customEnvPrefix = 'NEXUSML_UI_';
	const customEnvVariables = Object.keys(process.env)
		.filter((key) => key.startsWith(customEnvPrefix))
		.reduce((env, key) => {
			env[`process.env.${key}`] = JSON.stringify(process.env[key]);
			return env;
		}, {});

	// Add the custom environment variables to the DefinePlugin
	config.plugins.push(new webpack.DefinePlugin(customEnvVariables));

	return config;
});
