import { Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { type JSX, Suspense } from "solid-js";
import { AppProviders } from "#src/app-providers";
import _appCss from "#src/app.css";
import { DeploymentInfo } from "#src/features/deployment-info";

export default function App(): JSX.Element {
	return (
		<Router
			root={(props) => (
				<AppProviders>
					<Title>Sudoku</Title>
					<a href="/">Index</a>
					<a href="/about">About</a>
					<Suspense fallback={<div class="news-list-nav">Loading...</div>}>
						{props.children}
						<DeploymentInfo />
					</Suspense>
				</AppProviders>
			)}
		>
			<FileRoutes />
		</Router>
	);
}
