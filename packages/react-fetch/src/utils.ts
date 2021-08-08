import { useMemo, useContext } from 'react';
import { SwrPlusContext } from './provider';

export const useIsRejected = () => {
	const swrPlus = useContext(SwrPlusContext);
	return useMemo(
		() => swrPlus.rejected.filter(({ id }) => !swrPlus.globalErrorBlackList[id])[0],
		[swrPlus.globalErrorBlackList, swrPlus.rejected]
	);
};
export const useIsPending = () => {
	const swrPlus = useContext(SwrPlusContext);
	return useMemo(
		() => !!swrPlus.pending.filter((id) => !swrPlus.globalLoaderBlackList[id]).length,
		[swrPlus.globalLoaderBlackList, swrPlus.pending]
	);
};
function hasObjectPrototype(o: any): boolean {
	return Object.prototype.toString.call(o) === '[object Object]';
}

function isPlainObject(o: any): o is Object {
	if (!hasObjectPrototype(o)) {
		return false;
	}

	// If has modified constructor
	const ctor = o.constructor;
	if (typeof ctor === 'undefined') {
		return true;
	}

	// If has modified prototype
	const prot = ctor.prototype;
	if (!hasObjectPrototype(prot)) {
		return false;
	}

	// If constructor does not have an Object-specific method
	if (!prot.hasOwnProperty('isPrototypeOf')) {
		return false;
	}

	// Most likely a plain Object
	return true;
}

/**
 * Hashes the value into a stable hash.
 */
export function stableValueHash(value: React.DependencyList): string {
	return JSON.stringify(value, (_, val) =>
		isPlainObject(val)
			? Object.keys(val)
					.sort()
					.reduce((result, key) => {
						result[key] = val[key];
						return result;
					}, {} as any)
			: val
	);
}
