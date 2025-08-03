import { defineConfig } from "@solidjs/start/config";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	server: {
		preset: "cloudflare_module",
		compatibilityDate: "2025-07-30",
	},
	vite: {
		plugins: [
			// @ts-expect-error: verify
			tsConfigPaths(),
		],
		worker: {
			format: "es",
			rollupOptions: {
				output: { esModule: true },
			},

			// @ts-expect-error: verify
			plugins: () => [tsConfigPaths()],
		},
	},
});
