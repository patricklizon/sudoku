import prettier from 'eslint-config-prettier';
import js from '@eslint/js';
import { includeIgnoreFile } from '@eslint/compat';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import { fileURLToPath } from 'node:url';
import ts from 'typescript-eslint';
import svelteConfig from './svelte.config.js';
import importPlugin from 'eslint-plugin-import';
import pluginVitest from '@vitest/eslint-plugin';
import oxlint from 'eslint-plugin-oxlint';
const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default ts.config(
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs.recommended,
	prettier,
	...svelte.configs['flat/prettier'],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		ignores: ['eslint.config.js', 'svelte.config.js'],

		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				svelteConfig,
			},
		},
	},
	{
		files: ['**/*.svelte', 'src/**/*.ts', './*.ts'],

		plugins: {
			import: importPlugin,
		},
		rules: {
			...importPlugin.configs.rules,
			'import/no-unresolved': 'off', // check done by typescript
			'import/order': [
				'warn',
				{
					'newlines-between': 'always',
					alphabetize: { order: 'asc', caseInsensitive: true },
				},
			],
			'import/no-default-export': 'warn',
		},
	},

	{
		name: 'eslint/overrides',
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js', 'src/**/*.{ts,mts,tsx}'],
		rules: {
			'prefer-object-spread': 'error',
		},
	},

	{
		name: 'vitest/overrides',
		files: ['src/**/__tests__/*', 'src/**/*.spec.*'],
		...pluginVitest.configs.recommended,
		rules: {
			...pluginVitest.configs.recommended.rules,
			'vitest/valid-expect': 'off', // TODO: Does not recognize chai
			'vitest/valid-title': 'off', // TODO: Does not recognize Function.name
			'vitest/require-hook': 'error',
			'vitest/prefer-spy-on': 'warn',
			'vitest/prefer-mock-promise-shorthand': 'warn',
			'vitest/prefer-hooks-in-order': 'warn',
			'vitest/prefer-each': 'warn',
			'vitest/prefer-called-with': 'warn',
			'vitest/padding-around-all': 'warn',
			'vitest/no-test-return-statement': 'warn',
			'vitest/no-test-prefixes': 'warn',
			'vitest/no-standalone-expect': 'error', // Expects should be within test blocks
			'vitest/no-interpolation-in-snapshots': 'error', // Can cause unstable snapshots
			'vitest/no-focused-tests': 'error',
			'vitest/no-duplicate-hooks': 'error', // Indicates confusing/redundant setup
			'vitest/no-disabled-tests': 'error', // Prevents accumulating "dead" test code
			'vitest/no-conditional-tests': 'error', // Tests should be deterministic
			'vitest/no-conditional-expect': 'error', // Expectations should be consistent
			'vitest/no-commented-out-tests': 'error',
			'vitest/max-nested-describe': 'error',
		},
	},

	oxlint.configs['flat/all'],
);

// export default [
// 	{
// 		name: 'app/files-to-lint',
// 		files: ['**/*.{ts,mts,tsx,vue}'],
// 	},

// 	{
// 		name: 'app/files-to-ignore',
// 		ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**', 'src/**/*.spec.*'],
// 	},

// 	...pluginVue.configs['flat/essential'],
// 	...pluginVue.configs['flat/recommended'],
// 	...pluginVue.configs['flat/strongly-recommended'],

// 	...vueTsEslintConfig({
// 		extends: [
// 			'recommended',
// 			'eslintRecommended',
// 			'recommendedTypeChecked',
// 			'stylisticTypeChecked',
// 			'strictTypeChecked',
// 		],
// 	}),

// 	{
// 		files: ['src/**/*.vue', 'src/**/*.ts', './*.ts'],
// 		ignores: ['src/helpers/tests/**/*.ts'],

// 		plugins: {
// 			import: importPlugin,
// 		},
// 		rules: {
// 			...importPlugin.configs.rules,
// 			'import/no-unresolved': 'off', // check done by typescript
// 			'import/order': [
// 				'warn',
// 				{
// 					'newlines-between': 'always',
// 					alphabetize: { order: 'asc', caseInsensitive: true },
// 				},
// 			],
// 			'import/no-default-export': 'warn',
// 		},
// 	},

// 	{
// 		name: 'typescript/overrides',
// 		rules: {
// 			'@typescript-eslint/consistent-type-definitions': ['error', 'type'],
// 		},
// 	},

// 	{
// 		name: 'eslint/overrides',
// 		files: ['src/**/*.{ts,mts,tsx}'],
// 		rules: {
// 			'prefer-object-spread': 'error',
// 		},
// 	},

// 	{
// 		name: 'vitest/overrides',
// 		files: ['src/**/__tests__/*', 'src/**/*.spec.*'],
// 		...pluginVitest.configs.recommended,
// 		rules: {
// 			...pluginVitest.configs.recommended.rules,
// 			'vitest/valid-expect': 'off', // TODO: Does not recognize chai
// 			'vitest/valid-title': 'off', // TODO: Does not recognize Function.name
// 			'vitest/require-hook': 'error',
// 			'vitest/prefer-spy-on': 'warn',
// 			'vitest/prefer-mock-promise-shorthand': 'warn',
// 			'vitest/prefer-hooks-in-order': 'warn',
// 			'vitest/prefer-each': 'warn',
// 			'vitest/prefer-called-with': 'warn',
// 			'vitest/padding-around-all': 'warn',
// 			'vitest/no-test-return-statement': 'warn',
// 			'vitest/no-test-prefixes': 'warn',
// 			'vitest/no-standalone-expect': 'error', // Expects should be within test blocks
// 			'vitest/no-interpolation-in-snapshots': 'error', // Can cause unstable snapshots
// 			'vitest/no-focused-tests': 'error',
// 			'vitest/no-duplicate-hooks': 'error', // Indicates confusing/redundant setup
// 			'vitest/no-disabled-tests': 'error', // Prevents accumulating "dead" test code
// 			'vitest/no-conditional-tests': 'error', // Tests should be deterministic
// 			'vitest/no-conditional-expect': 'error', // Expectations should be consistent
// 			'vitest/no-commented-out-tests': 'error',
// 			'vitest/max-nested-describe': 'error',
// 		},
// 	},

// 	oxlint.configs['flat/all'],
// 	skipFormatting,
// ];
