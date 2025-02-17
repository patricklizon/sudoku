import { getRandomInt } from './get-random-int';
import type { Mutable } from './types/mutable';

/**
 * @returns deeply cloned shuffled array
 */
export function toShuffledArray<A extends unknown[] | readonly unknown[]>(a: Readonly<A>): A {
	return shuffleArray<Mutable<A>>(structuredClone(a));
}

/**
 * @returns mutated array
 */
export function shuffleArray<A extends unknown[]>(a: A): A {
	let randomIdx: number;
	for (let idx = 0; idx < a.length; idx++) {
		randomIdx = getRandomInt(a.length);
		[a[idx], a[randomIdx]] = [a[randomIdx], a[idx]];
	}

	return a;
}
