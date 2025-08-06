/**
 * @file This module defines the context for deployment information.
 * It provides a context provider for accessing details like deployment ID, timestamp, host, etc..
 * The deployment information is loaded from server-side environment variables.
 */

import { createContext, createResource, type ParentComponent } from "solid-js";
import { getRequestEvent } from "solid-js/web";
import type { DeploymentInfo } from "#lib/domain/deployment/types";
import { isEmpty } from "#lib/utils/is-empty";
import { isNil } from "#lib/utils/is-nil";

export type TDeploymentCtx = {
	id: Option<DeploymentInfo["id"]>;
	timestamp: Option<DeploymentInfo["timestamp"]>;
	host: Option<DeploymentInfo["host"]>;
	pullRequestURL: Option<DeploymentInfo["pullRequestURL"]>;
};

export const DeploymentCtx = createContext<Option<TDeploymentCtx>>();

function loadDeployment(
	/** exposed for tests */
	_override?: Option<TDeploymentCtx>,
): TDeploymentCtx {
	"use server";
	const event = getRequestEvent();
	if (isNil(event)) throw new Error("No request context");

	const env = event.nativeEvent.context.cloudflare.env;
	// TODO: figure out how to inject it for better local development
	// see https://github.com/nitrojs/nitro/issues/3461
	// const env = {
	// 	DEPLOYMENT_ID: "local-dev",
	// 	DEPLOYMENT_TIMESTAMP: "2025-08-03T18:50:39Z",
	// 	DEPLOY_URL: "http://192.168.0.1",
	// 	PULL_REQUEST_URL: "http://www.google.com",
	// };
	return (
		_override ?? {
			id: env.DEPLOYMENT_ID,
			timestamp: isEmpty(env.DEPLOYMENT_TIMESTAMP)
				? undefined
				: new Date(env.DEPLOYMENT_TIMESTAMP).toISOString(),
			host: isEmpty(env.DEPLOY_URL) ? undefined : env.DEPLOY_URL,
			pullRequestURL: isEmpty(env.PULL_REQUEST_URL) ? undefined : env.PULL_REQUEST_URL,
		}
	);
}

export const DeploymentInfoCtxProvider: ParentComponent<{
	/** exposed for tests */
	_override?: TDeploymentCtx;
}> = (props) => {
	const [info] = createResource(() => props._override ?? loadDeployment(), {
		deferStream: false,
	});

	// return <DeploymentInfoCtx.Provider value={info()}>{props.children}</DeploymentInfoCtx.Provider>;
	return <DeploymentCtx.Provider value={info()}>{props.children}</DeploymentCtx.Provider>;
};
