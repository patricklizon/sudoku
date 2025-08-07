/**
 * @file This module defines the context for deployment information.
 * It provides a context provider for accessing details like deployment ID, timestamp, host, etc..
 */

import { createContext, createResource, type ParentComponent } from "solid-js";
import { getRequestEvent } from "solid-js/web";
import type { DeploymentInfo } from "#lib/domain/deployment/types";
import { isEmpty } from "#lib/utils/is-empty";
import { isNil } from "#lib/utils/is-nil";

export type TDeploymentCtx = {
	id: Option<DeploymentInfo["id"]>;
	timestamp: Option<DeploymentInfo["timestamp"]>;
	pullRequestURL: Option<DeploymentInfo["pullRequestURL"]>;
};

export const DeploymentCtx = createContext<Option<TDeploymentCtx>>();

function loadDeployment(
	/** exposed for tests */
	_getRequestEvent?: typeof getRequestEvent,
): TDeploymentCtx {
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
export const DeploymentCtxProvider: ParentComponent<DeploymentCtxProviderProps> = (props) => {
	const [info] = createResource(() => loadDeployment(props._getRequestEvent), {
		deferStream: false,
	});

	return <DeploymentCtx.Provider value={info()}>{props.children}</DeploymentCtx.Provider>;
};
