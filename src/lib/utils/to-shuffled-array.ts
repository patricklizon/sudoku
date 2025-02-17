import { getRandomInt } from './get-random-int';

/**
 * @returns deeply cloned shuffled array
 */
export function toShuffledArray<A extends unknown[]>(a: Readonly<A>): A {
	return shuffleArray(structuredClone<A>(a));
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
