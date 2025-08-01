import { tables } from "./db/tables";

export type DB = IDBDatabase;

export async function initDB(): Promise<DB> {
	return await new Promise((resolve, reject) => {
		const request = indexedDB.open("sudoku", 1);

		request.onupgradeneeded = (): void => {
			const db = request.result;

			let os;
			for (const t of tables) {
				os = db.createObjectStore(t.name, { keyPath: "" });

				// TODO: fix types
				for (const { name, keyPath, options } of Object.values(t.index)) {
					os.createIndex(name, keyPath, options);
				}
			}
		};

		request.onerror = (_e): void => {
			reject();
		};

		request.onsuccess = (): void => {
			resolve(request.result);
		};
	});
}
