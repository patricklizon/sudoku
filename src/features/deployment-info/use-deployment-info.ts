import { type Accessor, createMemo, createSignal, onMount, useContext } from "solid-js";
import { DeploymentCtx } from "#src/context/deployment/context";
import { isEmpty } from "#src/lib/utils/is-empty";
import { isNil } from "#src/lib/utils/is-nil";

type DeploymentInfoEntry = {
	label: string;
	value: Option<string>;
};

export function useDeploymentInfo(): Accessor<DeploymentInfoEntry[]> {
	const ctx = useContext(DeploymentCtx);
	if (isNil(ctx)) throw new Error(`Must be inside ${DeploymentCtx.Provider.name}`);

	const [formattedTimestamp, setFormattedTimestamp] = createSignal<Option<string>>();

	onMount(function formatTimeInLocalTimeZoneAtClient() {
		if (isNil(ctx.timestamp) || isEmpty(ctx.timestamp)) return;

		setFormattedTimestamp(
			new Intl.DateTimeFormat(undefined, {
				dateStyle: "medium",
				timeStyle: "medium",
			}).format(new Date(ctx.timestamp)),
		);
	});

	const result = createMemo<DeploymentInfoEntry[]>(() => [
		{ label: "Deployment ID", value: ctx.id },
		{ label: "Deployed At", value: formattedTimestamp() },
		{ label: "Deploy URL", value: ctx.host },
		{ label: "Pull Request URL", value: ctx.pullRequestURL },
	]);

	return result;
}
