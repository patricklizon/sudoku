import { getRandomInt } from './get-random-number';

/**
 * @returns deeply cloned shuffled array
 */
export function toShuffledArray<A extends unknown[]>(a: Readonly<A>): A {
	const copyA = structuredClone<A>(a);

	let randomIdx = 0;
	for (let idx = 0; idx < a.length; idx++) {
		randomIdx = getRandomInt(a.length);
		[copyA[idx], copyA[randomIdx]] = [copyA[randomIdx], copyA[idx]];
	}

	return copyA;
}
