import { test, expect } from "vitest";
import { isValidUrl } from "./is-valid-url";

test.each([
	{ url: "https://www.google.com", description: "a valid HTTPS URL" },
	{
		url: "http://www.google.com:3000/path?query=1#hash",
		description: "a valid HTTP URL with path, query, and hash",
	},
	{ url: "https://sub.domain.co.uk/page", description: "a valid URL with a subdomain and path" },
	{ url: "http://192.168.1.1/dashboard", description: "a URL with an IPv4 address and path" },
	{ url: "https://example.com", description: "a normal HTTPS URL" },
	{ url: "https://sub.domain.co.uk", description: "a URL with a subdomain" },
])("returns true for $description", ({ url }) => {
	expect(isValidUrl(url), `given value: ${url}`).toEqual(true);
});

test.each([
	{ url: "just some text", description: "plain text" },
	{ url: "www.example.com", description: "a URL missing a protocol (http/https)" },
	{ url: "", description: "an empty string" },
	{ url: "https://www.google .com", description: "a malformed URL with spaces" },
	{ url: "http://-example.com", description: "a domain starting with a hyphen" },
	{ url: "http://example-.com", description: "a domain ending with a hyphen" },
	{ url: "http://.example.com", description: "a domain starting with a dot" },
	{ url: "http://example.com.", description: "a domain ending with a dot" },
	{ url: "http://example..com", description: "a domain with consecutive dots" },
	{ url: "http://exa$mple.com", description: "a domain with an invalid character ($)" },
	// TODO: implement
	// { url: "http://exam@ple.com", description: "a domain with an invalid character (@)" },
	{ url: "http://999.999.999.999", description: "an invalid IPv4 address" },
])("returns false for $description", ({ url }) => {
	expect(isValidUrl(url), `given value: ${url}`).toEqual(false);
});
