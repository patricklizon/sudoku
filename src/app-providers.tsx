import { MetaProvider } from "@solidjs/meta";
import type { JSX } from "solid-js";
import { DeploymentProvider } from "./context/deployment";

export type ProvidersProps = ComponentCommonProps<{
	children?: JSX.Element;
}>;

export function AppProviders(props: ProvidersProps): JSX.Element {
	return (
		<DeploymentProvider>
			<MetaProvider>{props.children}</MetaProvider>
		</DeploymentProvider>
	);
}
