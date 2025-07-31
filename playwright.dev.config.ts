import { defineConfig } from '@playwright/test';
import baseConfig from './playwright.config';

const baseURL = 'http://localhost:5173';

export default defineConfig({
	...baseConfig,
	use: {
		...baseConfig.use,
		baseURL,
	},
	webServer: {
		command: 'bun run dev',
		url: baseURL,
		reuseExistingServer: true,
		timeout: 30_000,
	},
});
