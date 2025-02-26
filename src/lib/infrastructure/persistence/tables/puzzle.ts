import { config } from '@/lib/config';
import type { DBPuzzle } from '@/lib/domain/puzzle';
import type { ObjectStoreIndexRecord } from '@/lib/utils/types/object-store';

export const puzzleTbl = {
	name: config.db.table.puzzle,
	index: {
		difficulty: {
			name: 'difficulty',
			keyPath: 'difficulty',
			options: {
				unique: false,
			},
		},
	} satisfies ObjectStoreIndexRecord<keyof DBPuzzle>,
};
