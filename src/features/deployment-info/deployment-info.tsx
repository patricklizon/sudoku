import { createMemo, Index, Show, type JSX } from "solid-js";
import type { DeploymentInfo } from "#lib/domain/deployment/types";
import { isEmpty } from "#lib/utils/is-empty";
import { isValidUrl } from "#lib/utils/is-valid-url";
import { isNil } from "#src/lib/utils/is-nil";
import { Anchor } from "#ui/anchor";
import { DeploymentInfoTestId } from "./deployment-info.testid";
import type { DeploymentInfoEntry } from "./types";
import { useDeploymentInfo } from "./use-deployment-info";

export type DeploymentInfoProps = ComponentCommonProps;

/**
 * Renders details about the environment in which the application is currently deployed.
 */
export function DeploymentInfo(props: DeploymentInfoProps): JSX.Element {
	const entries = useDeploymentInfo();

	return (
		<ul data-testid={props["data-testid"] ?? DeploymentInfoTestId.root}>
			<Index each={entries()}>{(it) => <EntryItem {...it()} />}</Index>
		</ul>
	);
}

type EntryItemProps = Pick<DeploymentInfoEntry, "label" | "isVisibleEmpty" | "value">;

function EntryItem(props: EntryItemProps): JSX.Element {
	return (
		<Show when={props.isVisibleEmpty === true || !isEmpty(props.value)}>
			<li data-testid={DeploymentInfoTestId.entry}>
				<span data-testid={DeploymentInfoTestId.entryLabel}>{props.label}</span>:{" "}
				<EntryValue value={props.value} />
			</li>
		</Show>
	);
}

type EntryValueProps = ComponentCommonProps<{
	value: DeploymentInfoEntry["value"];
}>;

function EntryValue(props: EntryValueProps): JSX.Element {
	const testId = createMemo<string>(() => {
		return props["data-testid"] ?? DeploymentInfoTestId.entryValue;
	});

	const value = createMemo<string>(() => {
		if (isEmpty(props.value) || isNil(props.value)) return "unknown";
		return props.value;
	});

	return (
		<>
			{isValidUrl(value()) ? (
				<Anchor href={value()} data-testid={testId()}>
					{value()}
				</Anchor>
			) : (
				<span data-testid={testId()}>{value()}</span>
			)}
		</>
	);
}
