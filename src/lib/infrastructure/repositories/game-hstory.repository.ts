import type { GameHistoryEntry, DBGameHistoryEntry } from "#lib/domain/game-history/types";
import { createRandomStringId } from "#lib/domain/id/create-random-id";
import { mapDateToTimeISOString } from "#lib/domain/time/mappers/date-to-time-iso-string";
import type { DB } from "#lib/infrastructure/persistence";
import { gameTimerTbl } from "#lib/infrastructure/persistence/db/tables/game-timer";
import { isNil } from "#lib/utils/is-nil";
import { noop } from "#lib/utils/noop";

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

			_txn.addEventListener("complete", noop);
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

			_txn.addEventListener("complete", noop);
		});
	}
}
