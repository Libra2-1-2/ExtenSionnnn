/* eslint-disable no-undef */
module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: [
		"eslint:recommended",
		"plugin:react/recommended",
		"plugin:@typescript-eslint/recommended",
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: "latest",
		sourceType: "module",
	},
	plugins: ["react", "@typescript-eslint"],
	rules: {
		'no-mixed-spaces-and-tabs': 'off',
		'indent': 'off',
		"no-debugger": "off",
		"@typescript-eslint/no-extra-semi": "off"		
		// indent: ["error", "tab"],
		// "linebreak-style": ["error", "unix"],
		// quotes: ["error", "double"],
		// semi: ["error", "always"],
	},
};
