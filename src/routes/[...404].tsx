import { Title } from "@solidjs/meta";
import { HttpStatusCode } from "@solidjs/start";
import type { JSX } from "solid-js";
import { DeploymentInfo } from "#src/features/deployment-info";

export default function NotFound(): JSX.Element {
	return (
		<main>
			<Title>Not Found</Title>
			<HttpStatusCode code={404} />
			<h1>Page Not Found</h1>
			<DeploymentInfo />
			<p>
				Visit{" "}
				<a href="https://start.solidjs.com" target="_blank">
					start.solidjs.com
				</a>{" "}
				to learn how to build SolidStart apps.
			</p>
		</main>
	);
}
