import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { type JSX, Suspense } from "solid-js";
import "./app.css";

export default function App(): JSX.Element {
	return (
		<Router
			root={(props) => (
				<MetaProvider>
					<Title>SolidStart - Basic</Title>
					<a href="/">Index</a>
					<a href="/about">About</a>
					<Suspense fallback={<div class="news-list-nav">Loading...</div>}>
						{props.children}
					</Suspense>
				</MetaProvider>
			)}
		>
			<FileRoutes />
		</Router>
	);
}
