import { Index, type JSX, Show } from "solid-js";
import type { DeploymentInfo } from "#src/lib/domain/deployment";
import { isValidUrl } from "#src/lib/utils/is-valid-url";
import { DeploymentInfoTestId } from "./deployment-info.testid";
import { useDeploymentInfo } from "./use-deployment-info";

type DeploymentInfoEntry = {
	label: string;
	value: Option<string>;
};

export type DeploymentInfoProps = ComponentCommonProps;

/**
 * Renders details about the environment in which the application is currently deployed.
 */
export function DeploymentInfo(props: DeploymentInfoProps): JSX.Element {
	const entries = useDeploymentInfo();

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
		<ul data-testid={props["data-testid"] ?? DeploymentInfoTestId.root}>
			<Index each={entries()}>{(it) => <EntryItem {...it()} />}</Index>
		</ul>
	);
}

type EntryItemProps = {
	label: DeploymentInfoEntry["label"];
	value: DeploymentInfoEntry["value"];
};

function EntryItem(props: EntryItemProps): JSX.Element {
	return (
		<li data-testid={DeploymentInfoTestId.entry}>
			<span data-testid={DeploymentInfoTestId.entryLabel}>{props.label}</span>:{" "}
			<span data-testid={DeploymentInfoTestId.entryValue}>
				<Show when={props.value} fallback="unknown">
					{(val) => <EntryValue value={val()} />}
				</Show>
			</span>
		</li>
	);
}

type EntryValueProps = {
	value: string;
};

function EntryValue(props: EntryValueProps): JSX.Element {
	return (
		<Show when={isValidUrl(props.value)} fallback={props.value}>
			<a href={props.value} target="_blank" rel="noopener noreferrer">
				{props.value}
			</a>
		</Show>
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
