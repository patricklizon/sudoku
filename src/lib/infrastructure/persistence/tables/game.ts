import type { DBGame } from '@/lib/domain/game';
import type { ObjectStoreIndexRecord } from '@/lib/utils/types/object-store';

export const gameTbl = {
	name: 'game',
	index: {
		mode: {
			name: 'mode',
			keyPath: 'mode',
			options: {
				unique: false,
			},
		},
		lastOpenedAt: {
			name: 'lastOpenedAt',
			keyPath: 'lastOpenedAt',
			options: {
				unique: false,
			},
		},
		difficulty: {
			name: 'difficulty',
			keyPath: 'difficulty',
			options: {
				unique: false,
			},
		},
		status: {
			name: 'status',
			keyPath: 'status',
			options: {
				unique: false,
			},
		},
	} satisfies ObjectStoreIndexRecord<keyof DBGame>,
};
