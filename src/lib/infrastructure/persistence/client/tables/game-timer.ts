import type { DBGameTimer } from '$lib/domain/game-timer';
import type { ObjectStoreIndexRecord } from '$lib/utils/types/object-store';

export const gameTimerTbl = {
	name: 'game-timer',
	index: {
		gameId: {
			name: 'gameId',
			keyPath: 'gameId',
			options: {
				unique: false,
			},
		},
		timeLimit_timeSpent: {
			name: 'timeLimit_timeSpent',
			keyPath: ['timeLimit', 'timeSpent'],
			options: {
				unique: false,
			},
		},
	} satisfies ObjectStoreIndexRecord<keyof DBGameTimer>,
};
