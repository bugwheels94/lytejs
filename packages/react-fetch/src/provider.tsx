import React, { ReactNode, useCallback, useMemo, useRef, useState } from 'react';
type fulfilled = { id: string; data: any };
const defaultContext = {
	store: {} as Record<string, any>,
	mounted: {} as React.RefObject<Record<string, (React.Dispatch<any>)[]>>,
	promises: {} as React.RefObject<Record<string, any>>,
	pending: { current: [] } as React.RefObject<string[]>,
	registerPending: (_: string) => { },
	validating: { current: [] } as React.RefObject<string[]>,
	registerValidating: (_: string) => { },
	fulfilled: { current: [] } as React.RefObject<fulfilled[]>,
	rejected: { current: [] } as React.RefObject<{ id: string; reason: string }[]>,
	globalLoaderBlackList: {} as Record<string, boolean>,
	globalErrorBlackList: {} as Record<string, boolean>,
	addToGlobalLoaderBlackList: (_: string) => { },
	removeFromGlobalLoaderBlackList: (_: string) => { },
	addToGlobalErrorBlackList: (_: string) => { },
	removeFromGlobalErrorBlackList: (_: string) => { },
	registerMount: (_: string, _a: React.Dispatch<any>) => { },
	unregisterMount: (_: string, _a: React.Dispatch<any>) => { },
	registerRejected: (_: { id: string; reason: string }) => { },
	registerFulfilled: (_: fulfilled) => { },
	setStore: (_: any) => { },
};
export const SwrPlusContext = React.createContext(defaultContext);
export const SwrPlusProvider = ({ children }: { children: ReactNode }) => {
	const mounted = useRef<Record<string, (React.Dispatch<any>)[]>>({});
	const promises = useRef<Record<string, any>>({});
	const [store, setStore] = useState<Record<string, any>>({});
	const pending = useRef<string[]>([]);
	const validating = useRef<string[]>([]);
	const fulfilled = useRef<fulfilled[]>([]);
	const rejected = useRef<{ id: string; reason: string }[]>([]);
	const [globalLoaderBlackList, setGlobalLoaderBlackList] = useState({});
	const [globalErrorBlackList, setGlobalErrorBlackList] = useState({});
	const registerMount = useCallback(
		(key: string, setCounter: React.Dispatch<any>) => {
			const temp = mounted.current[key] || []
			temp.push(setCounter)
			mounted.current[key] = temp;
		},
		[mounted]
	);
	const reset = useCallback(
		(key: string) => {
			fulfilled.current = fulfilled.current.filter(({ id }) => key !== id);
			rejected.current = rejected.current.filter(({ id }) => key !== id);
			pending.current = pending.current.filter((p) => key !== p);
			validating.current = validating.current.filter((p) => key !== p);
		},
		[fulfilled, pending, rejected, validating]
	);

	const unregisterMount = useCallback(
		(key: string, setCounter: React.Dispatch<any>) => {
			const result = mounted.current[key];
			if (!result) return;
			var index = result.indexOf(setCounter);
			if (index !== -1) {
				result.splice(index, 1);
			}
			if (result.length === 0) {
				delete mounted.current[key];
				reset(key);
			}
		},
		[mounted, reset]
	);
	const registerPending = useCallback(
		(key: string) => {
			if (!mounted.current[key]) return; // halt if the component unmounted in mid of the API call
			fulfilled.current = fulfilled.current.filter(({ id }) => key !== id);
			rejected.current = rejected.current.filter(({ id }) => key !== id);
			pending.current = pending.current.concat(key);
		},
		[fulfilled, mounted, pending, rejected]
	);
	const registerValidating = useCallback(
		(key: string) => {
			if (!mounted.current[key]) return; // halt if the component unmounted in mid of the API call
			validating.current = validating.current.concat(key);
		},
		[mounted]
	);
	const registerRejected = useCallback(
		(key: { id: string; reason: string }) => {
			if (!mounted.current[key.id]) return; // halt if the component unmounted in mid of the API call
			rejected.current = rejected.current.concat(key);
			pending.current = pending.current.filter((p) => key.id !== p);
			validating.current = validating.current.filter((p) => key.id !== p);
		},
		[mounted, pending, rejected, validating]
	);
	const registerFulfilled = useCallback(
		(key: fulfilled) => {
			if (!mounted.current[key.id]) return; // halt if the component unmounted in mid of the API call
			fulfilled.current = fulfilled.current.concat(key);
			pending.current = pending.current.filter((p) => key.id !== p);
			validating.current = validating.current.filter((p) => key.id !== p);
		},
		[fulfilled, mounted, pending, validating]
	);
	const contextValue = useMemo(
		() => ({
			addToGlobalLoaderBlackList: (key: string) => {
				setGlobalLoaderBlackList((state) => ({ ...state, [key]: true }));
			},
			removeFromGlobalLoaderBlackList: (key: string) => {
				setGlobalLoaderBlackList((state) => ({ ...state, [key]: false }));
			},
			addToGlobalErrorBlackList: (key: string) => {
				setGlobalErrorBlackList((state) => ({ ...state, [key]: true }));
			},
			removeFromGlobalErrorBlackList: (key: string) => {
				setGlobalErrorBlackList((state) => ({ ...state, [key]: false }));
			},
			mounted: mounted,
			pending,
			fulfilled,
			rejected,
			globalLoaderBlackList,
			globalErrorBlackList,
			registerMount,
			unregisterMount,
			registerPending,
			registerRejected,
			registerFulfilled,
			store,
			setStore,
			validating,
			registerValidating,
			promises
		}),
		[
			mounted,
			pending,
			fulfilled,
			rejected,
			globalLoaderBlackList,
			globalErrorBlackList,
			registerMount,
			unregisterMount,
			registerPending,
			registerRejected,
			registerFulfilled,
			store,
			validating,
			registerValidating,
			promises
		]
	);
	return <SwrPlusContext.Provider value={contextValue}>{children}</SwrPlusContext.Provider>;
};
