import type { Primitive } from './primitive';
import type { RecordKey } from './record';

export type DeepReadonly<T> = T extends Primitive
	? Readonly<T>
	: T extends Record<RecordKey, unknown>
		? Readonly<{ [K in keyof T]: DeepReadonly<T[K]> }>
		: T extends readonly unknown[]
			? T extends readonly [infer Head, ...infer Tail]
				? readonly [DeepReadonly<Head>, ...DeepReadonly<Tail>]
				: Readonly<DeepReadonly<T[number]>[]>
			: never;
