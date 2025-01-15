import type { Nil } from '@/lib/types/option';

export function isNil(it: unknown): it is Nil {
	return it === undefined || it === null;
}
