import { createContext, useContext, type ParentComponent, createResource } from "solid-js";
import { getRequestEvent } from "solid-js/web";
import type { DeploymentInfo } from "#src/lib/domain/deployment";
import { isEmpty } from "#src/lib/utils/is-empty";
import { isNil } from "#src/lib/utils/is-nil";

type DeploymentInfoCtx = {
	id: Option<DeploymentInfo["id"]>;
	timestamp: Option<DeploymentInfo["timestamp"]>;
	host: Option<DeploymentInfo["host"]>;
	pullRequestURL: Option<DeploymentInfo["pullRequestURL"]>;
};

const DeploymentInfoContext = createContext<DeploymentInfoCtx>();

function loadDeploymentInfo(): DeploymentInfoCtx {
	// "use server";
	const event = getRequestEvent();
	if (isNil(event)) throw new Error("No request context");

	const env = event.nativeEvent.context.cloudflare.env;
	// TODO: figure out how to inject it for better local development
	// see https://github.com/nitrojs/nitro/issues/3461
	// const env = {
	// 	DEPLOYMENT_ID: "local-dev",
	// 	DEPLOYMENT_TIMESTAMP: "2025-08-03T18:50:39Z",
	// 	DEPLOY_URL: "",
	// 	PULL_REQUEST_URL: "",
	// };
	return {
		id: env.DEPLOYMENT_ID,
		timestamp: isEmpty(env.DEPLOYMENT_TIMESTAMP)
			? undefined
			: new Date(env.DEPLOYMENT_TIMESTAMP).toISOString(),
		host: isEmpty(env.DEPLOY_URL) ? undefined : env.DEPLOY_URL,
		pullRequestURL: isEmpty(env.PULL_REQUEST_URL) ? undefined : env.PULL_REQUEST_URL,
	};
}

export const DeploymentInfoProvider: ParentComponent = (props) => {
	const [info] = createResource(loadDeploymentInfo, { deferStream: false });

	return (
		<DeploymentInfoContext.Provider value={info()}>{props.children}</DeploymentInfoContext.Provider>
	);
};

export function useDeploymentInfo(): DeploymentInfoCtx {
	const ctx = useContext(DeploymentInfoContext);
	if (isNil(ctx)) throw new Error("Must be inside DeploymentInfoProvider");

	return ctx;
}
