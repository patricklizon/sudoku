import type { GameId } from '#src/lib/domain/id';
import type { TimeISOString, TimeSecond } from '#src/lib/domain/time';
import type { Option } from '#src/lib/utils/types/option';

export type GameTimer = {
	gameId: GameId;
	id: string;
	status: 'on' | 'off';
	timeLimit: Option<TimeSecond>;
	timeSpent: TimeSecond;
};

export type DBGameTimer = GameTimer & {
	updatedAt: TimeISOString;
	createdAt: TimeISOString;
};
