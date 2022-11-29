import type { AnyFunction, Reverse } from '../../typings/helpers.js';

export function equivalent(x: unknown, y: unknown): boolean {
	const [xt, yt] = [typeof x, typeof y];
	if (xt !== yt) return false;
	if (xt === 'function') return true;
	if (xt === 'symbol') {
		const xv = (x as symbol).toString();
		const yv = (y as symbol).toString();
		return !xv.localeCompare(yv);
	}

	if (xt !== 'object') return x === y;
	if (x == null || y == null) return x === y;

	if (Array.isArray(x) !== Array.isArray(y)) return false;
	if (Array.isArray(x) && Array.isArray(y)) {
		if (x.length !== y.length) return false;
		for (let i = 0; i < x.length; i++) {
			if (!equivalent(x[i], y[i])) return false;
		}
		return true;
	}

	const [xk, yk] = [Object.keys(x), Object.keys(y)];
	const keys = new Set([...xk, ...yk]);
	if (xk.length !== yk.length || keys.size !== xk.length) return false;
	for (const k of keys) {
		// @ts-expect-error - guaranteed indexable
		if (!equivalent(x[k], y[k])) return false;
	}
	return true;
}

/**
 * inverse - reverses the order of provided arguments to fn parameters
 * @param fn any function with one or more arguments
 * @returns a curried function to take in the arguments
 */
export function inverse<Function extends AnyFunction>(fn: Function) {
	type Reversed = Reverse<Parameters<Function>>;
	type Returned = ReturnType<Function>;
	return (...parameters: Reversed): Returned => fn(...parameters.reverse());
}

/**
 * regexp - implementation of global RegExp constructor with escaped pattern
 * @param pattern passed in the form of string literal
 * @param flags unique set of characters from `d|g|i|m|s|u|y`
 * @returns dynamically constructed RegExp object
 */
export function regexp(pattern: string, flags?: string): RegExp {
	return new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
}

/**
 * unique - transform an array to a set and back to array
 * @param array items to be inspected
 * @returns duplicate-free version of the array input
 */
export function unique<T>(array: T[]): T[] {
	return [...new Set(array)];
}
