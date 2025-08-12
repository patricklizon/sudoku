import { type Accessor, createMemo, createSignal, onMount, useContext } from "solid-js";
import { DeploymentContext } from "#src/context/deployment";
import { isEmpty } from "#src/lib/utils/is-empty";
import { isNil } from "#src/lib/utils/is-nil";
import type { DeploymentInfoEntry } from "./types";

/**
 * Retrieves and formats deployment information for display.
 * It consumes the `DeploymentCtx` to get raw deployment details and
 * formats the timestamp for local timezone display.
 *
 * @throws {Error} When is called outside of a `DeploymentCtx.Provider`.
 */
export function useDeploymentInfo(): Accessor<DeploymentInfoEntry[]> {
	const ctx = useContext(DeploymentContext);
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
		{ label: "Deployment ID", value: ctx.id, isVisibleEmpty: true },
		{ label: "Deployed At", value: formattedTimestamp(), isVisibleEmpty: true },
		{ label: "Pull Request URL", value: ctx.pullRequestURL },
	]);

	return result;
}
