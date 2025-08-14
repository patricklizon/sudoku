export function isDev(): boolean {
	return !["prod", "production"].includes(process.env.NODE_ENV ?? "dev");
}
