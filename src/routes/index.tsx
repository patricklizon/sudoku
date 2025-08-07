import { Title } from "@solidjs/meta";
import { type JSX, createSignal, createResource, For, Show, onMount, Index } from "solid-js";
import {
	DIFFICULTY_LEVEL,
	DIFFICULTY_LEVEL_BY_NAME,
} from "#lib/domain/puzzle/difficulty/constants";
import type { PuzzleDifficultyLevel } from "#lib/domain/puzzle/types";
import { PuzzleService } from "#lib/services/client/puzzle";
import { Button } from "#ui/button";

let puzzleService: PuzzleService;

export default function Home(): JSX.Element {
	onMount(() => {
		puzzleService = new PuzzleService();
	});

	const [difficultyLevel, setDifficultyLevel] = createSignal<PuzzleDifficultyLevel>(
		DIFFICULTY_LEVEL[1],
	);
	const [puzzleReq, setPuzzleReq] = createSignal<{
		difficulty: PuzzleDifficultyLevel;
		id: number;
	}>();

	const [puzzle] = createResource(puzzleReq, async (req) => {
		const res = await puzzleService.create(req.difficulty);
		return res.payload.puzzle;
	});

	const difficultyOptions = Object.entries(DIFFICULTY_LEVEL_BY_NAME);

	function requestPuzzle(): void {
		setPuzzleReq({ difficulty: difficultyLevel(), id: Date.now() });
	}

	return (
		<main>
			<Title>home</Title>
			<select
				value={difficultyLevel()}
				onInput={(e) =>
					setDifficultyLevel(e.currentTarget.value as unknown as PuzzleDifficultyLevel)
				}
				data-testid="difficulty-level-selector"
			>
				<For each={difficultyOptions}>
					{([name, level]) => (
						<option value={level} data-testid="option">
							{name}
						</option>
					)}
				</For>
			</select>
			<Button onClick={requestPuzzle} data-testid="action-generate-puzzle">
				Go
			</Button>

			<div>
				<Show when={puzzle.loading}>
					<p data-testid="loading">loading</p>
				</Show>

				{/* TODO: verify */}
				<Show when={puzzle.error as unknown}>
					{(error) => <p>{Error.isError(error) ? error.message : "unknown error"}</p>}
				</Show>

				<Show when={puzzle()} fallback={<p>No puzzle requested yet.</p>}>
					{(p) => (
						<div data-testid="game-board">
							<Index each={p().problem}>
								{(cell, idx) => (
									<>
										<span data-testid="game-board.cell">{cell() ?? "_"}</span>
										{(idx + 1) % 9 === 0 && <br />}
									</>
								)}
							</Index>
						</div>
					)}
				</Show>
			</div>
		</main>
	);
}
