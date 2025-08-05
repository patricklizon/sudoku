import { MetaProvider } from "@solidjs/meta";
import type { JSX } from "solid-js";
import { DeploymentInfoCtxProvider } from "./context/deployment";

export type ProvidersProps = ComponentCommonProps<{
	children?: JSX.Element;
}>;

export function AppProviders(props: ProvidersProps): JSX.Element {
	return (
		<DeploymentInfoCtxProvider>
			<MetaProvider>{props.children}</MetaProvider>
		</DeploymentInfoCtxProvider>
	);
}
