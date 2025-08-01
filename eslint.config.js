import js from "@eslint/js";
import { includeIgnoreFile } from "@eslint/compat";
import prettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import oxlint from "eslint-plugin-oxlint";
import playwright from "eslint-plugin-playwright";
import solid from "eslint-plugin-solid";
import pluginVitest from "@vitest/eslint-plugin";
import globals from "globals";
import { fileURLToPath } from "node:url";
import tseslint from "typescript-eslint";

const gitignorePath = fileURLToPath(new URL("./.gitignore", import.meta.url));

export default tseslint.config(
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	...tseslint.configs.strictTypeChecked,
	...tseslint.configs.stylisticTypeChecked,
	solid.configs["flat/recommended"],
	solid.configs["flat/typescript"],

	{
		name: "global-options",
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
				...globals.es2025,
				...globals.serviceworker,
			},
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},

	{
		name: "typescript-overrides",
		files: ["**/*.{ts,tsx}"],
		rules: {
			"prefer-object-spread": "error",
			"@typescript-eslint/consistent-indexed-object-style": "off",
			"@typescript-eslint/consistent-type-definitions": ["error", "type"],
			"@typescript-eslint/no-unnecessary-type-parameters": "off",
			"@typescript-eslint/explicit-function-return-type": "error",
			"@typescript-eslint/explicit-member-accessibility": ["error", { accessibility: "no-public" }],
			"@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
			"@typescript-eslint/strict-boolean-expressions": [
				"error",
				{
					allowString: false,
					allowNumber: false,
					allowNullableObject: true,
				},
			],
			"@typescript-eslint/prefer-nullish-coalescing": "error",
			"@typescript-eslint/consistent-type-imports": "error",
		},
	},

	{
		name: "import",
		files: ["**/*.{ts,tsx}"],
		plugins: { import: importPlugin },
		rules: {
			...importPlugin.configs.recommended.rules,
			...importPlugin.configs.typescript.rules,
			"import/no-unresolved": "off", // check done by typescript
			"import/no-default-export": "warn",
			"import/no-amd": "warn",
			"import/no-commonjs": "warn",
			"import/no-import-module-exports": "warn",
			"import/no-nodejs-modules": "warn",
			"import/no-mutable-exports": "error",
			"import/order": [
				"warn",
				{
					"newlines-between": "never",
					pathGroups: [
						{
							pattern: "#*/**",
							group: "external",
							position: "after",
						},
					],
					pathGroupsExcludedImportTypes: ["builtin"],
					alphabetize: { order: "asc", caseInsensitive: true },
				},
			],
		},
	},

	{
		name: "vitest",
		files: ["**/*.spec.{ts,tsx}"],
		plugins: { vitest: pluginVitest },
		rules: {
			...pluginVitest.configs.recommended.rules,
			"@typescript-eslint/no-non-null-assertion": "off",
			"vitest/no-disabled-tests": "error",
			"vitest/no-focused-tests": "error",
			"vitest/no-conditional-tests": "error",
			"vitest/no-commented-out-tests": "error",
			"vitest/max-nested-describe": ["error", { max: 3 }],
		},
	},

	{
		name: "playwright",
		files: ["tests/**"],
		...playwright.configs["flat/recommended"],
	},

	oxlint.configs["flat/all"],
	prettier,
);
