import type { JSX } from "solid-js";
import { getRequestEvent } from "solid-js/web";
import type { DeploymentInfo } from "#src/lib/domain/deployment";
import { isEmpty } from "#src/lib/utils/is-empty";
import { isNil } from "#src/lib/utils/is-nil";

/**
 * Renders details about the environment in which the application is currently deployed.
 */
export function DeploymentInfo(): JSX.Element {
	const deploymentInfo = getDeploymentInfo();

	return (
		<footer>
			<p>Deployment ID: {deploymentInfo.id}</p>
			<p>Deploy URL: {deploymentInfo.host}</p>
		</footer>
	);
}

type DeploymentInfoQueryResult = {
	id: Option<DeploymentInfo["id"]>;
	host: Option<DeploymentInfo["host"]>;
};

/**
 * Handles GET requests to retrieve deployment information.
 * This function extracts deployment data from the Cloudflare environment
 * available through the SolidStart request event.
 */
function getDeploymentInfo(): DeploymentInfoQueryResult {
	"use server";

	const event = getRequestEvent();
	if (isNil(event)) throw new Error("No request context");

	const env = event.nativeEvent.context.cloudflare.env;
	return {
		id: env.DEPLOYMENT_ID,
		host: isEmpty(env.DEPLOY_URL) ? new URL(event.request.url).host : env.DEPLOY_URL,
	};
}
