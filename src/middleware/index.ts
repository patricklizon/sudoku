import { createMiddleware } from "@solidjs/start/middleware";
import { createNonce } from "#src/lib/utils/create-nonce";
import { isDev } from "#src/lib/utils/is-dev";
import { makeCsp } from "./csp";

const csp = makeCsp({ isDev: isDev(), nonceFactory: createNonce });

export default createMiddleware({
	onRequest: [csp],
});
