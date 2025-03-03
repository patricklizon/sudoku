import type { CreatePuzzleWorkerRequest, CreatePuzzleWorkerResponse } from './types';

import { createPuzzle } from '@/lib/domain/puzzle';

self.addEventListener('message', (event: MessageEvent<CreatePuzzleWorkerRequest>): void => {
	const { payload, requestId } = event.data;
	self.postMessage({
		requestId,
		payload: {
			puzzle: createPuzzle(payload.difficulty),
		},
	} satisfies CreatePuzzleWorkerResponse);
});
