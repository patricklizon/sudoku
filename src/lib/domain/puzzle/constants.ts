/**
 * The code point offset from letter 'A' to '1' in ASCII
 */
export const ENCODED_EMPTY_FIELD_CODE_POINT_OFFSET = Math.abs(
	('A'.codePointAt(0) ?? 0) - ('1'.codePointAt(0) ?? 0),
);
