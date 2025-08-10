import { defineConfig, devices } from "@playwright/test";
import baseConfig from "./playwright.config";

const baseURL = "http://localhost:5173";

export default defineConfig({
	...baseConfig,
	use: {
		...baseConfig.use,
		baseURL,
	},
	projects: [
		{
			name: "chromium",
			use: {
				...devices["Desktop Chrome"],
				launchOptions: {
					args: ["--remote-debugging-port=9222"],
				},
			},
		},
	],
	webServer: {
		command: "bun run dev",
		url: baseURL,
		reuseExistingServer: true,
		timeout: 30_000,
	},
});
