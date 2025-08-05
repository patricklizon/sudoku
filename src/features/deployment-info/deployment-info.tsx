import { createEffect, createSignal, For, type JSX, onMount, Show } from "solid-js";
import { useDeploymentInfo } from "#src/context/deployment";
import type { DeploymentInfo } from "#src/lib/domain/deployment";
import { isEmpty } from "#src/lib/utils/is-empty";
import { isNil } from "#src/lib/utils/is-nil";
import { isValidUrl } from "#src/lib/utils/is-valid-url";

/**
 * Renders details about the environment in which the application is currently deployed.
 */
export function DeploymentInfo(): JSX.Element {
	const info = useDeploymentInfo();

	const [formattedTimestamp, setFormattedTimestamp] = createSignal<Option<string>>();

	onMount(function formatTimeInLocalTimeZone() {
		if (isNil(info.timestamp) || isEmpty(info.timestamp)) return;

		setFormattedTimestamp(
			new Intl.DateTimeFormat(undefined, {
				dateStyle: "medium",
				timeStyle: "medium",
			}).format(new Date(info.timestamp)),
		);
	});

	const [entries, setEntries] = createSignal<[label: string, value: Option<string>][]>();

	createEffect(function updateEntries() {
		setEntries([
			["Deployment ID", info.id],
			["Deployed At", formattedTimestamp()],
			["Deploy URL", info.host],
			["Pull Request URL", info.pullRequestURL],
		]);
	});

	return (
		<footer>
			<For each={entries()}>
				{([label, value]) => {
					return isNil(value) ? null : (
						<p>
							{label}: <EntryValue value={value} />{" "}
						</p>
					);
				}}
			</For>
		</footer>
	);
}

type EntryValueProps = {
	value: string;
};

function EntryValue(props: EntryValueProps): JSX.Element {
	const [isUrl, setIsUrl] = createSignal(false);

	createEffect(() => {
		setIsUrl(isValidUrl(props.value));
	});

	return (
		<Show when={isUrl()} fallback={props.value}>
			<a href={props.value} target="_blank" rel="noopener noreferrer">
				{props.value}
			</a>
		</Show>
	);
}
