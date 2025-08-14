import { createMiddleware } from "@solidjs/start/middleware";
import { csp } from "./csp";

export default createMiddleware({
	onRequest: [csp],
});
