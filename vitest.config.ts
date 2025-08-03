import { fileURLToPath } from "node:url";
import solid from "vite-plugin-solid";
import tsConfigPaths from "vite-tsconfig-paths";
import { configDefaults, defineConfig } from "vitest/config";

const plugins = [solid(), tsConfigPaths()];
const setupFiles = ["./test/setup.ts"];

export default defineConfig({
	test: {
		exclude: [...configDefaults.exclude, "e2e/**"],
		root: fileURLToPath(new URL("./", import.meta.url)),
		globals: true,
		projects: [
			{
				// TODO: refactor - fix it
				// @ts-expect-error: it works
				plugins,
				test: {
					setupFiles,
					include: ["src/**/*.{test,spec}.ts"],
					name: "unit",
					environment: "node",
				},
			},
			{
				// TODO: refactor - fix it
				// @ts-expect-error: it works
				plugins,
				test: {
					setupFiles,
					testTimeout: 5000,
					include: ["src/**/*.browser.{test,spec}.tsx"],
					name: "browser",
					browser: {
						enabled: true,
						headless: true,
						provider: "playwright",
						instances: [{ browser: "chromium" }],
					},
				},
			},
		],
	},
	resolve: {
		conditions: ["development", "browser"],
	},
});
