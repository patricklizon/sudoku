import type { Puzzle } from '@/lib/domain/puzzle';
import type { CreatePuzzleWorkerRequest, CreatePuzzleWorkerResponse } from './types';
import worker from './create-puzzle.worker?worker&url';
import { createRandomStringId } from '@/lib/domain/id';

export class CreatePuzzleService {
	constructor() {
		this.worker = new Worker(worker, { type: 'module' });
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

	create(difficulty: Puzzle['difficulty']): Promise<CreatePuzzleWorkerResponse> {
		return new Promise<CreatePuzzleWorkerResponse>((resolve, reject) => {
			const onMessage = (e: MessageEvent<CreatePuzzleWorkerResponse>): void => {
				resolve(e.data);
				this.isProcessing = false;
				this.processNextTask();
			};

			const onError = (): void => {
				// TODO: implement
				reject(new Error('adio'));
				this.isProcessing = false;
				this.processNextTask();
			};

			this.tasks.push(() => {
				this.worker.addEventListener('error', onError, { once: true });
				this.worker.addEventListener('message', onMessage, { once: true });

				this.worker.postMessage({
					payload: { difficulty },
					requestId: createRandomStringId(),
					type: '@sudoku/request/puzzle/create/one',
				} satisfies CreatePuzzleWorkerRequest);
			});

			this.processNextTask();
		});
	}
}
