import { config } from '@/lib/config';
import { tables } from './tables';

export type DB = IDBDatabase;

export async function initDB(): Promise<DB> {
	return await new Promise((resolve, reject) => {
		const request = indexedDB.open(config.db.name, config.db.version);

		request.onupgradeneeded = (): void => {
			const db = request.result;

			let os;
			for (const t of tables) {
				os = db.createObjectStore(t.name, { keyPath: '' });

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
