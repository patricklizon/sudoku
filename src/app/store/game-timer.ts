import { type Signal, signal } from '@preact/signals';
import type { Option } from '@/lib/utils/types/option';
import { createBrodcastChannel } from '@/lib/infrastructure/brodcast-channel';
import type { GameTimer } from '@/lib/domain/game-timer';

type GameTimerStore = Option<GameTimer>;

export function createGameTimerStore(id: GameTimer['id']): Signal {
	const channel = createBrodcastChannel(id);
	const store = signal<GameTimerStore>();

	store.subscribe((v) => {
		channel.postMessage({ type: '@game-timer/update', v });
	});

	channel.addEventListener('message', (e) => {
		if (e.data.type !== '@game-timer/db-change' && e.data.id !== id) return;
		// ... impl
	});

	return store;
}
