import { createGameId, type DBGame, type Game } from '$lib/domain/game';
import type { Puzzle } from '$lib/domain/puzzle';
import { mapDateToTimeISOString } from '$lib/domain/time';
import type { DB } from '$lib/infrastructure/persistence';
import { gameTbl } from '$lib/infrastructure/persistence/db/tables/game';
import { isNil } from '$lib/utils/is-nil';
import type { Option } from '$lib/utils/types/option';

export class GameRepository {
	constructor(db: DB) {
		this.db = db;
	}

	private db: DB;
	static tableName = gameTbl.name;

	async save(
		payload: {
			mode: Game['mode'];
			puzzleId: Puzzle['id'];
			puzzleDifficulty: Puzzle['difficulty'];
		},
		txn?: IDBTransaction,
	): Promise<DBGame> {
		return await new Promise<DBGame>((resolve, reject) => {
			const now = mapDateToTimeISOString(new Date());

			const result = {
				createdAt: now,
				difficulty: payload.puzzleDifficulty,
				id: createGameId(),
				lastOpenedAt: undefined,
				mode: payload.mode,
				puzzleId: payload.puzzleId,
				status: 'paused',
				updatedAt: now,
			} satisfies DBGame;

			const _txn = txn ?? this.db.transaction(GameRepository.tableName, 'readwrite');
			const store = _txn.objectStore(GameRepository.tableName);
			const request = store.add(result);

			request.addEventListener('success', () => {
				resolve(result);
			});

			request.addEventListener('error', () => {
				if (isNil(request.error)) return;
				reject(request.error);
			});

			_txn.addEventListener('complete', () => {

			});
		});
	}

	async getById(payload: { id: Game['id'] }, txn?: IDBTransaction): Promise<Option<DBGame>> {
		return await new Promise<DBGame>((resolve, reject) => {
			const _txn = txn ?? this.db.transaction(GameRepository.tableName, 'readonly');
			const store = _txn.objectStore(GameRepository.tableName);
			const request = store.get(payload.id);

			request.addEventListener('success', () => {
				resolve(request.result);
			});

			request.addEventListener('error', () => {
				if (isNil(request.error)) return;
				reject(request.error);
			});

			_txn.addEventListener('complete', () => {

			});
		});
	}
}
