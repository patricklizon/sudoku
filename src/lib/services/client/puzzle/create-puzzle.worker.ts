import { createPuzzle } from "#src/lib/domain/puzzle";
import type { CreatePuzzleWorkerRequest, CreatePuzzleWorkerResponse } from "./types";


self.addEventListener("message", (event: MessageEvent<CreatePuzzleWorkerRequest>): void => {
	const { payload, requestId } = event.data;
	self.postMessage({
		requestId,
		payload: {
			puzzle: createPuzzle(payload.difficulty),
		},
	} satisfies CreatePuzzleWorkerResponse);
});
