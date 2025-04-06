<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	import type { Puzzle, PuzzleDifficultyLevel } from '$lib/domain/puzzle';
	import { DIFFICULTY_LEVEL, DIFFICULTY_LEVEL_BY_NAME } from '$lib/domain/puzzle/difficulty';
	import { PuzzleService } from '$lib/services/client/puzzle';
	import type { Option } from '$lib/utils/types/option';

	let puzzleService: InstanceType<typeof PuzzleService>;

	onMount(() => {
		puzzleService = new PuzzleService();
	});

	let puzzlePromise = $state<Option<Promise<Puzzle>>>();
	function requestPuzzle(): void {
		puzzlePromise = puzzleService.create(difficultyLevel).then((r) => r.payload.puzzle);
	}

	let difficultyLevel = $state<PuzzleDifficultyLevel>(DIFFICULTY_LEVEL[1]);
	let difficultyOptions = $state<[string, PuzzleDifficultyLevel][]>(
		Object.entries(DIFFICULTY_LEVEL_BY_NAME),
	);
</script>

<select bind:value={difficultyLevel} data-testid="difficulty-level-selector">
	{#each difficultyOptions as [name, level] (name + level)}
		<option value={level} data-testid="option">{name}</option>
	{/each}
</select>

<button onclick={requestPuzzle} data-testid="action-generate-puzzle">Go</button>

<div>
	{#await puzzlePromise}
		<p transition:fade={{ delay: 200, duration: 200 }}>loading</p>
	{:then puzzle}
		{#if puzzle}
			<div transition:fade={{ delay: 200, duration: 200 }} data-testid="game-board">
				{#each puzzle.problem as cell, idx (idx)}
					<span data-testid="game-board.cell">{cell ?? '_'}</span>
					{#if (idx + 1) % 9 === 0}
						<br />
					{/if}
				{/each}
			</div>
		{/if}
	{:catch error}
		<p transition:fade={{ delay: 200, duration: 200 }}>{error.message}</p>
	{/await}
</div>
