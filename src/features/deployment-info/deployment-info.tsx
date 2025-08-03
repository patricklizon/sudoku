import { type JSX, createSignal, onMount } from "solid-js";
import { getRequestEvent } from "solid-js/web";
import type { DeploymentInfo } from "#src/lib/domain/deployment";
import { isEmpty } from "#src/lib/utils/is-empty";
import { isNil } from "#src/lib/utils/is-nil";

/**
 * Renders details about the environment in which the application is currently deployed.
 */

export function DeploymentInfo(): JSX.Element {
	const deploymentInfo = getDeploymentInfo();
	const [formattedTimestamp, setFormattedTimestamp] = createSignal<Option<string>>();

	onMount(() => {
		if (isNil(deploymentInfo.timestamp) || isEmpty(deploymentInfo.timestamp)) return;

		const date = new Date(deploymentInfo.timestamp);
		setFormattedTimestamp(
			new Intl.DateTimeFormat(undefined, { dateStyle: "full", timeStyle: "long" }).format(date),
		);
	});

	return (
		<footer>
			{isNil(deploymentInfo.id) ? null : <p>Deployment ID: {deploymentInfo.id}</p>}
			{isNil(formattedTimestamp()) ? null : <p>Deployed At: {formattedTimestamp()}</p>}
			{isNil(deploymentInfo.host) ? null : <p>Deploy URL: {deploymentInfo.host}</p>}
			{isNil(deploymentInfo.pullRequestURL) ? null : (
				<p>
					Pull Request URL:{" "}
					<a href={deploymentInfo.pullRequestURL} target="_blank">
						{deploymentInfo.pullRequestURL}
					</a>
				</p>
			)}
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
// TODO: extract to mapper, safely extract date
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
