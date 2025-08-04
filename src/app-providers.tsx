import { MetaProvider } from "@solidjs/meta";
import type { JSX } from "solid-js";
import { DeploymentInfoProvider } from "./context/deployment";

export type ProvidersProps = ComponentCommonProps<{
	children?: JSX.Element;
}>;

export function AppProviders(props: ProvidersProps): JSX.Element {
	return (
		<DeploymentInfoProvider>
			<MetaProvider>{props.children}</MetaProvider>
		</DeploymentInfoProvider>
	);
}
