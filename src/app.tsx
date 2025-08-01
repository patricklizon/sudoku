import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";
import { MetaProvider, Title } from "@solidjs/meta";

export default function App() {
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
