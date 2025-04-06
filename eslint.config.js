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

const parserOptions = {
	projectService: true,
	extraFileExtensions: ['.svelte'],
	parser: ts.parser,
	svelteConfig,
};

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
		name: 'svelte',
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		ignores: ['eslint.config.js', 'svelte.config.js'],

		languageOptions: {
			parserOptions,
		},
	},

	{
		name: 'imports',
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
		name: 'typescript',
		languageOptions: {
			parserOptions,
		},
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js', 'src/**/*.ts'],
		rules: {
			...ts.configs['strictTypeChecked'].rules,
			...ts.configs['stylisticTypeChecked'].rules,
			'@typescript-eslint/no-explicit-any': 'error',
			'@typescript-eslint/explicit-function-return-type': 'error',
			'@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'no-public' }],
			'@typescript-eslint/no-non-null-assertion': 'error',
			'@typescript-eslint/no-unused-vars': 'error',
			'@typescript-eslint/no-unnecessary-condition': 'error',
			'@typescript-eslint/strict-boolean-expressions': [
				'error',
				{
					allowString: false,
					allowNumber: false,
					allowNullableObject: true,
					allowNullableBoolean: true,
					allowNullableString: false,
					allowNullableNumber: false,
					allowAny: false,
				},
			],
			'@typescript-eslint/prefer-nullish-coalescing': 'error',
			'@typescript-eslint/consistent-type-imports': 'error',
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
