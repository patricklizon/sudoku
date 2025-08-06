import { createRandomStringId } from "#lib/domain/id/create-random-id";
import type { Puzzle } from "#lib/domain/puzzle/types";
import type { CreatePuzzleWorkerRequest, CreatePuzzleWorkerResponse } from "./types";

export class PuzzleService {
	constructor() {
		this.worker = new Worker(new URL("./create-puzzle.worker", import.meta.url), {
			type: "module",
		});
	}

	private worker: Worker;
	private tasks: (() => void)[] = [];
	private isProcessing = false;

	private processNextTask(): void {
		if (this.isProcessing || this.tasks.length === 0) return;

		this.isProcessing = true;
		this.tasks.shift()?.();
		this.isProcessing = true;
	}

	create(difficulty: Puzzle["difficultyLevel"]): Promise<CreatePuzzleWorkerResponse> {
		return new Promise<CreatePuzzleWorkerResponse>((resolve, reject) => {
			const onMessage = (e: MessageEvent<CreatePuzzleWorkerResponse>): void => {
				resolve(e.data);
				this.isProcessing = false;
				this.processNextTask();
			};

			const onError = (): void => {
				// TODO: implement error
				reject(new Error("adio"));
				this.isProcessing = false;
				this.processNextTask();
			};

			this.tasks.push(() => {
				this.worker.addEventListener("error", onError, { once: true });
				this.worker.addEventListener("message", onMessage, { once: true });

				this.worker.postMessage({
					payload: { difficulty },
					requestId: createRandomStringId(),
					type: "@sudoku/request/puzzle/create/one",
				} satisfies CreatePuzzleWorkerRequest);
			});

			this.processNextTask();
		});
	}
}
