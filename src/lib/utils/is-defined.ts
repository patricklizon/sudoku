import type { Nil, Option } from '@/lib/types/option';

export function isDefined<T>(it: Option<T>): it is T {
	return it !== undefined && it !== null;
}
