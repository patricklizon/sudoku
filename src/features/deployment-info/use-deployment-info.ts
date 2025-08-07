import { type Accessor, createMemo, createSignal, onMount, useContext } from "solid-js";
import { isEmpty } from "#lib/utils/is-empty";
import { isNil } from "#lib/utils/is-nil";
import { DeploymentCtx } from "#src/context/deployment";

type DeploymentInfoEntry = {
	label: string;
	value: Option<string>;
};

/**
 * Retrieves and formats deployment information for display.
 * It consumes the `DeploymentCtx` to get raw deployment details and
 * formats the timestamp for local timezone display.
 *
 * @throws {Error} When is called outside of a `DeploymentCtx.Provider`.
 */
export function useDeploymentInfo(): Accessor<DeploymentInfoEntry[]> {
	const ctx = useContext(DeploymentCtx);
	if (isNil(ctx)) throw new Error("Must be called inside DeploymentCtx.Provider");

	const [formattedTimestamp, setFormattedTimestamp] = createSignal<Option<string>>();

	onMount(function formatTimeInClientTimeZone() {
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
		{ label: "Pull Request URL", value: ctx.pullRequestURL },
	]);

	return result;
}
