import { isEmpty } from "./is-empty";

/**
 * Checks if a given string is a valid URL.
 * This function tries to create a URL object from the provided string.
 * If it succeeds without any errors, it means the string is a correctly formatted URL.
 * Otherwise, if an error occurs during the creation (e.g., the string is malformed), it means it's not a valid URL.
 */
export function isValidUrl(value: string): boolean {
	if (isEmpty(value)) return false;

	try {
		const parsed = new URL(value);
		if (!["http:", "https:"].includes(parsed.protocol)) return false;

		const invalidHostnameCharRegex = /[^A-Za-z0-9.-]/;
		if (invalidHostnameCharRegex.test(parsed.hostname)) return false;

		const ipv4Regex = /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
		const looksLikeIpv4Regex = /^\d+(\.\d+){3}$/;

		if (looksLikeIpv4Regex.test(parsed.hostname)) {
			return ipv4Regex.test(parsed.hostname);
		}

		const domainRegex = /^(?!-)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;

		return domainRegex.test(parsed.hostname);
	} catch {
		return false;
	}
}
