export type ObjectStoreIndexRecord<T extends string> = Partial<
	Record<
		T | `${T}_${T}`,
		{
			name: T | `${T}_${T}`;
			keyPath: T | T[];
			options?: IDBIndexParameters;
		}
	>
>;
