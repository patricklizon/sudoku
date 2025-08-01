import { fileURLToPath } from "node:url";
import { configDefaults, defineConfig } from "vitest/config";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	test: {
		exclude: [...configDefaults.exclude, "tests/**"],
		root: fileURLToPath(new URL("./", import.meta.url)),
	},
	plugins: [tsConfigPaths()],
});
