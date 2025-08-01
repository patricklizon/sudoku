import type { GameHistoryEntry, DBGameHistoryEntry } from "#src/lib/domain/game-history";
import { createRandomStringId } from "#src/lib/domain/id";
import { mapDateToTimeISOString } from "#src/lib/domain/time";
import type { DB } from "#src/lib/infrastructure/persistence";
import { gameTimerTbl } from "#src/lib/infrastructure/persistence/db/tables/game-timer";
import { isNil } from "#src/lib/utils/is-nil";

export class GameHistoryEntryRepository {
	constructor(db: DB) {
		this.db = db;
	}

	private db: DB;
	static tableName = gameTimerTbl.name;
	static tableIdx = gameTimerTbl.index;

	async save(
		payload: {
			gameId: GameHistoryEntry["gameId"];
			colIdx: GameHistoryEntry["colIdx"];
			rowIdx: GameHistoryEntry["rowIdx"];
			value: GameHistoryEntry["value"];
		},
		txn?: IDBTransaction,
	): Promise<DBGameHistoryEntry> {
		return await new Promise<DBGameHistoryEntry>((resolve, reject) => {
			const now = mapDateToTimeISOString(new Date());

			const result = {
				gameId: payload.gameId,
				createdAt: now,
				colIdx: payload.colIdx,
				rowIdx: payload.rowIdx,
				value: payload.value,
				id: createRandomStringId(),
			} satisfies DBGameHistoryEntry;

			const _txn = txn ?? this.db.transaction(GameHistoryEntryRepository.tableName, "readwrite");
			const store = _txn.objectStore(GameHistoryEntryRepository.tableName);
			const request = store.add(result);

			request.addEventListener("success", () => {
				resolve(result);
			});

			request.addEventListener("error", () => {
				if (isNil(request.error)) return;
				reject(request.error);
			});

			_txn.addEventListener("complete", () => {});
		});
	}

	async getByGameId(
		payload: { id: GameHistoryEntry["gameId"] },
		txn?: IDBTransaction,
	): Promise<GameHistoryEntry[]> {
		return await new Promise<GameHistoryEntry[]>((resolve, reject) => {
			const _txn = txn ?? this.db.transaction(GameHistoryEntryRepository.tableName, "readonly");
			const store = _txn.objectStore(GameHistoryEntryRepository.tableName);
			const idx = store.index(GameHistoryEntryRepository.tableIdx.gameId.name);
			const request = idx.getAll(payload.id);

			request.addEventListener("success", () => {
				resolve(request.result);
			});

			request.addEventListener("error", () => {
				if (isNil(request.error)) return;
				reject(request.error);
			});

			_txn.addEventListener("complete", () => {});
		});
	}
}
