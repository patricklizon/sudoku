import { useParams } from "@solidjs/router";
import type { JSX } from "solid-js";
import type { GameId } from "#src/lib/domain/id/types";

export default function GamePage(): JSX.Element {
	const params = useParams<Partial<{ id: GameId }>>();

	return (
		<main>
			<h1>Game</h1>
			<section>
				<p>hello universe</p>
				<p> game id: {params.id}</p>
			</section>
		</main>
	);
}
