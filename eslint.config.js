import pluginVue from 'eslint-plugin-vue';
import vueTsEslintConfig from '@vue/eslint-config-typescript';
import pluginVitest from '@vitest/eslint-plugin';
import oxlint from 'eslint-plugin-oxlint';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';

export default [
	{
		name: 'app/files-to-lint',
		files: ['**/*.{ts,mts,tsx,vue}'],
	},

	{
		name: 'app/files-to-ignore',
		ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**', 'src/**/*.spec.*'],
	},

	...pluginVue.configs['flat/essential'],
	...pluginVue.configs['flat/recommended'],
	...pluginVue.configs['flat/strongly-recommended'],

	...vueTsEslintConfig({
		extends: [
			'recommended',
			'eslintRecommended',
			'recommendedTypeChecked',
			'stylisticTypeChecked',
			'strictTypeChecked',
		],
	}),

	{
		name: 'typescript/overrides',
		rules: {
			'@typescript-eslint/consistent-type-definitions': ['error', 'type'],
		},
	},

	{
		name: 'eslint/overrides',
		files: ['src/**/*.{ts,mts,tsx}'],
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
	skipFormatting,
];
