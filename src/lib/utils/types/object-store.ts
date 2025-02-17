export type ObjectStoreIndexRecord<T extends string> = Partial<
	Record<T | `${T}_${T}` | `${T}_${T}_${T}`, string>
>;
