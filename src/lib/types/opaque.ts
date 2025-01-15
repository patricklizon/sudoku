export type Opaque<Brand extends string, T extends string | number> = T & {
	readonly __brand: Brand;
};
