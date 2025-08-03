import type { JSX } from "solid-js";
import { useDeploymentInfo } from "#src/context/deployment";
import type { DeploymentInfo } from "#src/lib/domain/deployment";
import { isEmpty } from "#src/lib/utils/is-empty";
import { isNil } from "#src/lib/utils/is-nil";

/**
 * Renders details about the environment in which the application is currently deployed.
 */

export function DeploymentInfo(): JSX.Element {
	const info = useDeploymentInfo();

	// if (!info) return null;

	const formattedTimestamp =
		isNil(info.timestamp) || isEmpty(info.timestamp)
			? null
			: new Intl.DateTimeFormat(undefined, { dateStyle: "full", timeStyle: "long" }).format(
					new Date(info.timestamp),
				);

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
