import type { Nil } from '@/lib/utils/types/option';

export type Timer = { id: string; timeSpent: number; status: string } & (
	| {
			direction: 'down';
			timeLimit: number;
	  }
	| {
			direction: 'up';
			timeLimit: Nil;
	  }
);
