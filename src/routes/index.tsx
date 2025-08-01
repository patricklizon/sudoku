import { Title } from "@solidjs/meta";
import { type JSX, createSignal, createResource, For, Show, onMount } from 'solid-js';


import type {  PuzzleDifficultyLevel } from '#src/lib/domain/puzzle';
import { DIFFICULTY_LEVEL, DIFFICULTY_LEVEL_BY_NAME } from '#src/lib/domain/puzzle/difficulty';
import { PuzzleService } from '#src/lib/services/client/puzzle';

let puzzleService: PuzzleService;

export default function Home(): JSX.Element {
	onMount(() => {
		puzzleService = new PuzzleService();
	});

	const [difficultyLevel, setDifficultyLevel] = createSignal<PuzzleDifficultyLevel>(DIFFICULTY_LEVEL[1]);
	const [puzzleParams, setPuzzleParams] = createSignal<PuzzleDifficultyLevel>();

	const [puzzle, {refetch}] = createResource(puzzleParams, async (difficulty) => {
		const res = await puzzleService.create(difficulty);
		return res.payload.puzzle;
	});

	const difficultyOptions = Object.entries(DIFFICULTY_LEVEL_BY_NAME);

	function requestPuzzle(): void {
		setPuzzleParams(difficultyLevel());
		refetch()
	}

	return (
		<main>
			<Title>home</Title>
			<select
				value={difficultyLevel()}
				onInput={(e) => setDifficultyLevel(e.currentTarget.value as unknown as PuzzleDifficultyLevel)}
				data-testid="difficulty-level-selector"
			>
				<For each={difficultyOptions}>
					{([name, level]) => (
						<option value={level} data-testid="option">{name}</option>
					)}
				</For>
			</select>

			<button onClick={requestPuzzle} data-testid="action-generate-puzzle">Go</button>

			<div>
				<Show when={puzzle.loading}>
  <p data-testid="loading">loading</p>
</Show>

<Show when={puzzle.error}>
  {(error) => <p>{error.message}</p>}
</Show>

<Show when={puzzle()} fallback={<p>No puzzle requested yet.</p>}>
  {(p) => (
    <div data-testid="game-board">
      <For each={p().problem}>
        {(cell, idx) => (
          <>
            <span data-testid="game-board.cell">{cell ?? '_'}</span>
            {(idx() + 1) % 9 === 0 && <br />}
          </>
        )}
      </For>
    </div>
  )}
</Show>
			</div>
		</main>
	);
}
