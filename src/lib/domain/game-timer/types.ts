import type { GameId } from '@/lib/domain/core/id';
import type { TimeISOString, TimeSecond } from '@/lib/domain/core/time';
import type { Option } from '@/lib/utils/types/option';

export type GameTimer = {
	gameId: GameId;
	id: string;
	status: 'on' | 'off';
	timeLimit: Option<TimeSecond>;
	timeSpent: TimeSecond;
	updatedAt: TimeISOString;
	createdAt: TimeISOString;
};
