import { createAsync } from "@solidjs/router";
import type { JSX } from "solid-js";
import { getDeploymentInfoQuery } from "#src/lib/queries/deployment";

/**
 * Renders details about the environment in which the application is currently deployed.
 */
export function DeploymentInfo(): JSX.Element {
	const deploymentInfo = createAsync(() => getDeploymentInfoQuery());

	return (
		<footer>
			<p>Deployment ID: {deploymentInfo()?.id}</p>
			<p>Deploy URL: {deploymentInfo()?.url}</p>
		</footer>
	);
}
