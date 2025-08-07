import { MetaProvider } from "@solidjs/meta";
import type { JSX } from "solid-js";
import { DeploymentCtxProvider } from "./context/deployment";

export type ProvidersProps = ComponentCommonProps<{
	children?: JSX.Element;
}>;

export function AppProviders(props: ProvidersProps): JSX.Element {
	return (
		<DeploymentCtxProvider>
			<MetaProvider>{props.children}</MetaProvider>
		</DeploymentCtxProvider>
	);
}
