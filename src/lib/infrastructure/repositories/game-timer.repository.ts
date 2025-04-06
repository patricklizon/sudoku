import type { GameTimer, DBGameTimer } from '$lib/domain/game-timer';
import { createRandomStringId } from '$lib/domain/id';
import { mapDateToTimeISOString, mapNumberToTimeSecond } from '$lib/domain/time';
import type { DB } from '$lib/infrastructure/persistence';
import { gameTimerTbl } from '$lib/infrastructure/persistence/db/tables/game-timer';
import { isDefined } from '$lib/utils/is-defined';
import { isNil } from '$lib/utils/is-nil';
import type { Option } from '$lib/utils/types/option';

export class GameTimerRepository {
	constructor(db: DB) {
		this.db = db;
	}

	private db: DB;
	static tableName = gameTimerTbl.name;
	static tableIdx = gameTimerTbl.index;

	async save(
		payload: {
			gameId: GameTimer['gameId'];
		},
		txn?: IDBTransaction,
	): Promise<DBGameTimer> {
		const gameTimer = await this.getByGameId({ id: payload.gameId });
		// TODO: extract error
		if (isDefined(gameTimer)) throw new Error('Timer already exists');

		return await new Promise<DBGameTimer>((resolve, reject) => {
			const now = mapDateToTimeISOString(new Date());
			const timeSpent = mapNumberToTimeSecond(0);
			// TODO: implement error
			if (isNil(timeSpent)) throw new TypeError('invalid data');

			const result = {
				gameId: payload.gameId,
				id: createRandomStringId(),
				status: 'off',
				timeLimit: undefined,
				timeSpent,
				updatedAt: now,
				createdAt: now,
			} satisfies DBGameTimer;

			const _txn = txn ?? this.db.transaction(GameTimerRepository.tableName, 'readwrite');
			const store = _txn.objectStore(GameTimerRepository.tableName);
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

	async getByGameId(
		payload: { id: GameTimer['gameId'] },
		txn?: IDBTransaction,
	): Promise<Option<DBGameTimer>> {
		return await new Promise<Option<DBGameTimer>>((resolve, reject) => {
			const _txn = txn ?? this.db.transaction(GameTimerRepository.tableName, 'readonly');
			const store = _txn.objectStore(GameTimerRepository.tableName);
			const idx = store.index(GameTimerRepository.tableIdx.gameId.name);
			const request = idx.get(payload.id);

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
