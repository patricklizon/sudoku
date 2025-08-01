import { defineConfig, devices } from "@playwright/test";

const baseURL = "http://localhost:3000";

export default defineConfig({
	testDir: "./tests",
	fullyParallel: !process.env.CI,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: process.env.CI ? "github" : "html",

	use: {
		baseURL,
		trace: process.env.CI ? "on" : "on-first-retry",
		screenshot: "only-on-failure",
	},

	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],

	webServer: {
		command: "bun run preview",
		url: baseURL,
		timeout: 60 * 2 * 1000,
	},
});
