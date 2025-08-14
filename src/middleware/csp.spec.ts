import type { FetchEvent } from "@solidjs/start/server";
import { test, expect } from "vitest";
import { makeCsp } from "#src/middleware/csp";

function makeEvent(url = "https://example.test/"): FetchEvent {
	const request = new Request(url, { headers: new Headers() });
	const response = new Response(null, { headers: new Headers() });
	const locals: Record<string, unknown> = {};
	// minimal shape that middleware uses
	return { request, response, locals, nativeEvent: {} } as unknown as FetchEvent;
}

test("sets Content-Security-Policy header", async () => {
	const e = makeEvent();
	const csp = makeCsp({ isDev: false, nonceFactory: () => "fake-nonce" });

	expect(typeof e.locals.nonce).toEqual("undefined");

	await csp(e);

	expect(typeof e.locals.nonce).toBe("string");
	expect(e.response.headers.get("Content-Security-Policy")).toMatchInlineSnapshot(
		`"base-uri 'none';connect-src 'self';default-src 'self';font-src 'self';form-action 'self';frame-ancestors 'none';img-src 'self' data:;manifest-src 'self';media-src 'self';object-src 'none';script-src 'nonce-fake-nonce' 'strict-dynamic';style-src 'self' 'nonce-fake-nonce';trusted-types 'default';upgrade-insecure-requests ;worker-src 'self';"`,
	);
});
