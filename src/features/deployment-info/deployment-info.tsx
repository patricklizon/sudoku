import { useDeploymentInfo } from "#src/context/deployment-info";
import type { DeploymentInfo } from "#src/lib/domain/deployment";
import { isNil } from "#src/lib/utils/is-nil";

/**
 * Renders details about the environment in which the application is currently deployed.
 */

// src/components/DeploymentInfo.tsx

export function DeploymentInfo() {
	const info = useDeploymentInfo();

	// if (!info) return null;

	const formattedTimestamp = info.timestamp
		? new Intl.DateTimeFormat(undefined, { dateStyle: "full", timeStyle: "long" }).format(
				new Date(info.timestamp),
			)
		: null;

	return (
		<footer>
			{isNil(info.id) ? null : <p>Deployment ID: {info.id}</p>}
			{isNil(formattedTimestamp) ? null : <p>Deployed At: {formattedTimestamp}</p>}
			{isNil(info.host) ? null : <p>Deploy URL: {info.host}</p>}
			{isNil(info.pullRequestURL) ? null : (
				<p>
					Pull Request URL:{" "}
					<a href={info.pullRequestURL} target="_blank">
						{info.pullRequestURL}
					</a>
				</p>
			)}
		</footer>
	);
}
