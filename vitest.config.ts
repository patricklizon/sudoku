import { fileURLToPath } from "node:url";
import solid from "vite-plugin-solid";
import tsConfigPaths from "vite-tsconfig-paths";
import { configDefaults, defineConfig } from "vitest/config";

const plugins = [solid(), tsConfigPaths()];
const setupFiles = ["./test/setup.ts"];

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
						screenshotFailures: !!process.env.CI,
						enabled: true,
						headless: false,
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
