import { fileURLToPath } from "node:url";
import solid from "vite-plugin-solid";
import tsConfigPaths from "vite-tsconfig-paths";
import { configDefaults, defineConfig } from "vitest/config";

const plugins = [solid(), tsConfigPaths()];
const setupFiles = ["./test/setup.ts"];

const isRunMode = process.argv.includes("--run");
const isCI = !!process.env.CI;

export default defineConfig({
	test: {
		globalSetup: "./test/global-setup.ts",
		exclude: [...configDefaults.exclude, "e2e/**"],
		root: fileURLToPath(new URL("./", import.meta.url)),
		globals: true,
		projects: [
			{
				// FIXME: types are incorrect
				// @ts-expect-error: it works
				plugins,
				test: {
					setupFiles,
					include: ["src/**/*.{test,spec}.{ts,tsx}"],
					name: "unit",
					environment: "node",
				},
			},
			{
				// FIXME: types are incorrect
				// @ts-expect-error: it works
				plugins,
				test: {
					setupFiles,
					testTimeout: 5000,

					include: ["src/**/*.{test,spec}.browser.tsx"],
					name: "browser",
					browser: {
						screenshotFailures: isCI,
						enabled: true,
						headless: isCI || isRunMode,
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
