import { defineConfig } from "@solidjs/start/config";

import tsConfigPaths from "vite-tsconfig-paths";
import dotenv from "dotenv";
const isDev = process.env.NODE_ENV === "dev";

/**
 * Loads environment variables from the `.dev.vars` file into `process.env`.
 * It ensures that environment variables and secrets are available to the application during local development.
 * This is needed because live reload is only available when running the application through Vite.
 * Developing with wrangler does not offer live reload.
 */
dotenv.config({ path: new URL("./.dev.vars", import.meta.url).pathname });

export default defineConfig({
	middleware: "src/middleware/index.ts",
	server: {
		preset: "cloudflare_module",
		compatibilityDate: "2025-07-30",
	},
	vite: {
		build: {
			rollupOptions: {
				output: {
					sourcemap: isDev ? "inline" : "hidden",
				},
			},
		},
		css: {
			devSourcemap: true,
		},
		plugins: [
			// @ts-expect-error: verify
			tsConfigPaths(),
		],
		worker: {
			format: "es",
			rollupOptions: {
				output: {
					esModule: true,
					sourcemap: isDev ? "inline" : "hidden",
				},
			},
			// @ts-expect-error: verify
			plugins: () => [tsConfigPaths()],
		},
	},
});
