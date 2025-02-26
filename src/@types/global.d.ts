interface NumberConstructor {
	isSafeInteger(it: unknown): it is number;
	isInteger(it: unknown): it is number;
}
