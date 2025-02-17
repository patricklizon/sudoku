import type { GameId } from '@/lib/domain/core/id';
import type { TimeSecond } from '@/lib/domain/core/time';
import type { Option } from '@/lib/utils/types/option';

export type GameTimer = {
	id: GameId;
	status: 'on' | 'off';
	timeLimit: Option<TimeSecond>;
	timeSpent: TimeSecond;
};
