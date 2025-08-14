import { randomBytes } from "node:crypto";
import type { RequestMiddleware } from "@solidjs/start/middleware";
import { isDev } from "#src/lib/utils/is-dev";

export const csp: RequestMiddleware = (event) => {
	const nonce = randomBytes(16).toString("base64");
	event.locals.nonce = nonce;

	const rule = new Map([
		["base-uri", "'none'"],
		["connect-src", "'self'"],
		["default-src", "'self'"],
		["font-src", "'self'"],
		["form-action", "'self'"],
		["frame-ancestors", "'none'"],
		["img-src", "'self' data:"],
		["manifest-src", "'self'"],
		["media-src", "'self'"],
		["object-src", "'none'"],
		["script-src", [`'nonce-${nonce}'`, "'strict-dynamic'"].join(" ")],
		["style-src", ["'self'", `'nonce-${nonce}'`].join(" ")],
		["trusted-types", "'default'"],
		["upgrade-insecure-requests", ""],
		["worker-src", "'self'"],
		// TODO: explore rule require-trusted-types-for - https://content-security-policy.com/require-trusted-types-for/
		// TODO: explore rule report-to - https://content-security-policy.com/report-to/
	]);

	if (isDev()) {
		rule.set(
			"connect-src",
			(rule.get("connect-src") ?? "") +
				[
					"ws://localhost:*",
					"wss://localhost:*",
					"ws://127.0.0.1:*",
					"wss://127.0.0.1:*",
					"http://localhost:*",
					"http://127.0.0.1:*",
				].join(" "),
		);
		rule.set("style-src", (rule.get("style-src") ?? "") + " 'unsafe-inline'");
		rule.set("img-src", (rule.get("img-src") ?? "") + " blob:");
		rule.set("media-src", (rule.get("media-src") ?? "") + " blob:");
		rule.set("worker-src", (rule.get("worker-src") ?? "") + " blob:");
		rule.delete("upgrade-insecure-requests");
	}

	let result = "";
	for (const [key, value] of rule.entries()) result += key + " " + value + ";";

	event.response.headers.set("Content-Security-Policy", result.replaceAll(/\s+/g, " "));
};
