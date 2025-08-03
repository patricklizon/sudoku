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
	const { id, timestamp, host, pullRequestURL } = deploymentInfo;

	const formattedTimestamp =
		isNil(timestamp) || isEmpty(timestamp)
			? null
			: new Intl.DateTimeFormat(undefined, { dateStyle: "full", timeStyle: "long" }).format(
					new Date(timestamp),
				);

	return (
		<footer>
			{isEmpty(id) ? null : <p>Deployment ID: {id}</p>}
			{isEmpty(formattedTimestamp) ? null : <p>Deployed At: {formattedTimestamp}</p>}
			{isEmpty(host) ? null : <p>Deploy URL: {host}</p>}
			{isEmpty(pullRequestURL) ? null : <p>Pull Request URL: {pullRequestURL}</p>}
		</footer>
	);
}

type DeploymentInfoQueryResult = {
	id: Option<DeploymentInfo["id"]>;
	timestamp: Option<DeploymentInfo["timestamp"]>;
	host: Option<DeploymentInfo["host"]>;
	pullRequestURL: Option<DeploymentInfo["pullRequestURL"]>;
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
		timestamp: isEmpty(env.DEPLOYMENT_TIMESTAMP)
			? undefined
			: new Date(env.DEPLOYMENT_TIMESTAMP).toISOString(),
		host: isEmpty(env.DEPLOY_URL) ? undefined : env.DEPLOY_URL,
		pullRequestURL: isEmpty(env.PULL_REQUEST_URL) ? undefined : env.PULL_REQUEST_URL,
	};
}
