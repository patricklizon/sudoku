/**
 * @file This module defines the context for deployment information.
 * It provides a context provider for accessing details like deployment ID, timestamp, host, etc..
 */

import { createContext, createResource, type ParentComponent } from "solid-js";
import { getRequestEvent } from "solid-js/web";
import type { DeploymentInfo } from "#src/lib/domain/deployment/types";
import { isEmpty } from "#src/lib/utils/is-empty";
import { isNil } from "#src/lib/utils/is-nil";

export type DeploymentCtx = {
	id: Option<DeploymentInfo["id"]>;
	timestamp: Option<DeploymentInfo["timestamp"]>;
	pullRequestURL: Option<DeploymentInfo["pullRequestURL"]>;
};

export const DeploymentContext = createContext<Option<DeploymentCtx>>();

function loadDeployment(
	/** exposed for tests */
	_getRequestEvent?: typeof getRequestEvent,
): DeploymentCtx {
	"use server";
	const event = (_getRequestEvent ?? getRequestEvent)();
	if (isNil(event)) throw new Error("No request context");

	const env = event.nativeEvent.context.cloudflare?.env ?? process.env;
	return {
		id: env.DEPLOYMENT_ID,
		timestamp: isEmpty(env.DEPLOYMENT_TIMESTAMP)
			? undefined
			: new Date(env.DEPLOYMENT_TIMESTAMP).toISOString(),
		pullRequestURL: isEmpty(env.PULL_REQUEST_URL) ? undefined : env.PULL_REQUEST_URL,
	};
}

export type DeploymentCtxProviderProps = {
	/** exposed for tests */
	_getRequestEvent?: typeof getRequestEvent;
};

/**
 * The deployment information loaded from server-side environment variables.
 */
export const DeploymentProvider: ParentComponent<DeploymentCtxProviderProps> = (props) => {
	const [info] = createResource(() => loadDeployment(props._getRequestEvent), {
		deferStream: false,
	});

	return <DeploymentContext.Provider value={info()}>{props.children}</DeploymentContext.Provider>;
};
