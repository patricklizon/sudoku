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

const CSP_HEADER_NAME = "Content-Security-Policy";
const FAKE_NONCE = "fake-nonce";

test("sets safe Content-Security-Policy header for production", async () => {
	const e = makeEvent();
	const csp = makeCsp({ isDev: false, nonceFactory: () => FAKE_NONCE });

	expect(typeof e.locals.nonce).toEqual("undefined");

	await csp(e);

	expect(e.locals.nonce).toEqual(FAKE_NONCE);

	const header = e.response.headers.get(CSP_HEADER_NAME);

	expect(header).toMatchInlineSnapshot(
		`"base-uri 'none';connect-src 'self';default-src 'self';font-src 'self';form-action 'self';frame-ancestors 'none';img-src 'self' data:;manifest-src 'self';media-src 'self';object-src 'none';script-src 'nonce-fake-nonce' 'strict-dynamic';style-src 'self' 'nonce-fake-nonce';upgrade-insecure-requests ;worker-src 'self';"`,
	);

	expect(header).not.toContain("unsafe-inline");
	expect(header).not.toContain("blob:");
	expect(header).toContain("upgrade-insecure-requests");
});

test("sets relaxed Content-Security-Policy header for development", async () => {
	const e = makeEvent();
	const csp = makeCsp({ isDev: true, nonceFactory: () => FAKE_NONCE });

	expect(e.locals.nonce).toEqual(undefined);

	await csp(e);

	expect(e.locals.nonce).toEqual(FAKE_NONCE);

	const header = e.response.headers.get(CSP_HEADER_NAME);

	expect(header).toMatchInlineSnapshot(
		`"base-uri 'none';connect-src 'self' ws://localhost:* wss://localhost:* ws://127.0.0.1:* wss://127.0.0.1:* http://localhost:* http://127.0.0.1:*;default-src 'self';font-src 'self';form-action 'self';frame-ancestors 'none';img-src 'self' data: blob:;manifest-src 'self';media-src 'self' blob:;object-src 'none';script-src 'nonce-fake-nonce' 'strict-dynamic';style-src 'self' 'nonce-fake-nonce' 'unsafe-inline';worker-src 'self' blob:;"`,
	);

	expect(header).toContain("unsafe-inline");
	expect(header).toContain("blob:");
	expect(header).not.toContain("upgrade-insecure-requests");
});

test("creates different headers for production and development", async () => {
	const devEvent = makeEvent();
	const devCSP = makeCsp({ isDev: true, nonceFactory: () => FAKE_NONCE });
	const prodEvent = makeEvent();
	const prodCSP = makeCsp({ isDev: false, nonceFactory: () => FAKE_NONCE });

	await devCSP(devEvent);
	await prodCSP(prodEvent);

	expect(devEvent.response.headers.get(CSP_HEADER_NAME)).not.toEqual(
		prodEvent.response.headers.get(CSP_HEADER_NAME),
	);
});
