// import { use } from "preact"
// import type { Game } from '@/lib/domain/game';
// import { type Signal, signal } from '@preact/signals';
// import type { Option } from '@/lib/utils/types/option';
// import { createBrodcastChannel, type ChannelMessage } from '@/lib/infrastructure/brodcast-channel';
// import { GameRepository } from '@/lib/infrastructure/repositories/game.repository';

// type GameStore = Option<Game>;

// const gameStoreMap = new Map<Game['id'], Signal<GameStore>>();

// async function createGameStore(
// 	id: Game['id'],
// 	gameRepository = new GameRepository(),
// ): Promise<Signal<GameStore>> {
// 	let store = gameStoreMap.get(id);
// 	if (!store) {
// 		store = signal<GameStore>(await gameRepository.getById({ id }));
// 		gameStoreMap.set(id, store);
// 	}

// 	const channel = createBrodcastChannel(id);
// 	channel.addEventListener('message', (e: { data: ChannelMessage }) => {
// 		if (e.data.type !== '@game/update' || e.data.payload.id !== id) return;

// 		const incoming = e.data.payload;
// 		const current = store.value;

// 		if (!current || incoming.updatedAt > current.updatedAt) {
// 			store.value = incoming;
// 		}
// 	});

// 	return store;
// }

// export function useGameStore(id: Game['id']): void {

// 	const gameRepository = new GameRepository();
// 	let store = gameStoreMap.get(id);
// 	if (!store) {
// 		store = signal<GameStore>(await gameRepository.getById({ id }));
// 		gameStoreMap.set(id, store);
// 	}

// 	const channel = createBrodcastChannel(id);
// 	channel.addEventListener('message', handleBrodcastChannelMessage);

// 	function handleBrodcastChannelMessage(e: { data: ChannelMessage }): void {
// 		if (e.data.type !== '@game/update' || e.data.payload.id !== id) return;

// 		const incoming = e.data.payload;
// 		const current = store.value;

// 		if (!current || incoming.updatedAt > current.updatedAt) {
// 			store.value = incoming;
// 		}
// 	}
// }
