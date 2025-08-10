// FIXME: rethink local storage for offline support
// eslint-disable-next-line: unicorn/no-abusive-eslint-disable
/* eslint-disable */
// @ts-nocheck

import { mapPuzzleToDB, type DBPuzzle, type Puzzle } from "#lib/domain/puzzle";
import { mapDateToTimeISOString } from "#lib/domain/time";
import type { DB } from "#lib/infrastructure/persistence";
import { puzzleTbl } from "#lib/infrastructure/persistence/db/tables/puzzle";
import { isNil } from "#lib/utils/is-nil";

export class PuzzleRepository {
	constructor(db: DB) {
		this.db = db;
	}

	private db: DB;
	static tableName = puzzleTbl.name;

	async save(payload: { puzzle: Puzzle }, txn?: IDBTransaction): Promise<DBPuzzle> {
		return await new Promise<DBPuzzle>((resolve, reject) => {
			const now = mapDateToTimeISOString(new Date());
			const result = mapPuzzleToDB(payload.puzzle, { createdAt: now });

			const _txn = txn ?? this.db.transaction(PuzzleRepository.tableName, "readwrite");
			const store = _txn.objectStore(PuzzleRepository.tableName);
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

	async getById(payload: { id: Puzzle["id"] }, txn?: IDBTransaction): Promise<Option<DBPuzzle>> {
		return await new Promise<DBPuzzle>((resolve, reject) => {
			const _txn = txn ?? this.db.transaction(PuzzleRepository.tableName, "readonly");
			const store = _txn.objectStore(PuzzleRepository.tableName);
			const request = store.get(payload.id);

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
