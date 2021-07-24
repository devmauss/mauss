export type Overwrite<T, K> = Omit<T, keyof K> & K;
export type PickByValue<T, V> = Pick<T, { [K in keyof T]: T[K] extends V ? K : never }[keyof T]>;
