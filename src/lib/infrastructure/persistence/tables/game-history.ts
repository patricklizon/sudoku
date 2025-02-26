import { config } from '@/lib/config';
import type { DBGameHistoryEntry } from '@/lib/domain/game-history';
import type { ObjectStoreIndexRecord } from '@/lib/utils/types/object-store';

export const gameHistoryTbl = {
	name: config.db.table.gameHistory,
	index: {
		gameId: {
			name: 'gameId',
			keyPath: 'gameId',
			options: {
				unique: false,
			},
		},
		gameId_createdAt: {
			name: 'gameId_createdAt',
			keyPath: ['gameId', 'createdAt'],
			options: {
				unique: false,
			},
		},
	} satisfies ObjectStoreIndexRecord<keyof DBGameHistoryEntry>,
};
