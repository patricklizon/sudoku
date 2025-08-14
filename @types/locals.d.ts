/// <reference types="@solidjs/start/env" />

declare module App {
	/**
	 * Locals available on request events throughout the application.
	 * These values are typically set by middleware and can be accessed
	 * in route handlers and other request processing functions.
	 */
	interface RequestEventLocals {
		/** A cryptographic nonce (number used once) for Content Security Policy */
		nonce: string;
	}
}
