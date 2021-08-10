import React, { ReactNode, useCallback, useMemo, useRef, useState } from 'react';
type fulfilled = { id: string; data: any };
const defaultContext = {
	store: {} as Record<string, any>,
	mounted: {} as Record<string, number>,
	pending: [] as string[],
	registerPending: (_: string) => {},
	validating: [] as string[],
	registerValidating: (_: string) => {},
	fulfilled: [] as fulfilled[],
	rejected: [] as { id: string; reason: string }[],
	globalLoaderBlackList: {} as Record<string, boolean>,
	globalErrorBlackList: {} as Record<string, boolean>,
	addToGlobalLoaderBlackList: (_: string) => {},
	removeFromGlobalLoaderBlackList: (_: string) => {},
	addToGlobalErrorBlackList: (_: string) => {},
	removeFromGlobalErrorBlackList: (_: string) => {},
	registerMount: (_: string) => {},
	unregisterMount: (_: string) => {},
	registerRejected: (_: { id: string; reason: string }) => {},
	registerFulfilled: (_: fulfilled) => {},
	setStore: (_: any) => {},
};
export const SwrPlusContext = React.createContext(defaultContext);
export const SwrPlusProvider = ({ children }: { children: ReactNode }) => {
	const mounted = useRef<Record<string, number>>({});
	const [store, setStore] = useState<Record<string, any>>({});
	const [pending, setPending] = useState<string[]>([]);
	const [validating, setValidating] = useState<string[]>([]);
	const [fulfilled, setFulfilled] = useState<fulfilled[]>([]);
	const [rejected, setRejected] = useState<{ id: string; reason: string }[]>([]);
	const [globalLoaderBlackList, setGlobalLoaderBlackList] = useState({});
	const [globalErrorBlackList, setGlobalErrorBlackList] = useState({});
	const registerMount = useCallback(
		(key: string) => {
			console.log('Will Register Mount', key, ' into ', mounted);
			mounted.current[key] = (mounted.current[key] || 0) + 1;
			console.log('Registered Mount', key, ' into ', mounted);
		},
		[mounted]
	);
	const reset = useCallback(
		(key: string) => {
			setFulfilled(fulfilled.filter(({ id }) => key !== id));
			setPending(pending.filter((p) => key !== p));
			setValidating(validating.filter((p) => key !== p));
			setRejected(rejected.filter((r) => key !== r.id));
		},
		[fulfilled, pending, rejected, validating]
	);

	const unregisterMount = useCallback(
		(key: string) => {
			const result = mounted.current[key];
			if (!result) return;
			if (result > 1) mounted.current[key] = result - 1;
			else {
				delete mounted.current[key];
				reset(key);
			}
		},
		[mounted, reset]
	);
	const registerPending = useCallback(
		(key: string) => {
			if (!mounted.current[key]) return; // halt if the component unmounted in mid of the API call
			setRejected(rejected.filter((r) => key !== r.id));
			setFulfilled(fulfilled.filter(({ id }) => key !== id));
			setPending(pending.concat(key));
		},
		[fulfilled, mounted, pending, rejected]
	);
	const registerValidating = useCallback(
		(key: string) => {
			if (!mounted.current[key]) return; // halt if the component unmounted in mid of the API call
			setValidating(pending.concat(key));
		},
		[mounted, pending]
	);
	const registerRejected = useCallback(
		(key: { id: string; reason: string }) => {
			if (!mounted.current[key.id]) return; // halt if the component unmounted in mid of the API call
			setRejected([key, ...rejected]);
			setValidating(validating.filter((p) => key.id !== p));
			setPending(pending.filter((req) => req !== key.id));
		},
		[mounted, pending, rejected, validating]
	);
	const registerFulfilled = useCallback(
		(key: fulfilled) => {
			console.log(mounted, key);
			if (!mounted.current[key.id]) return; // halt if the component unmounted in mid of the API call
			setFulfilled([key, ...fulfilled]);
			setValidating(validating.filter((p) => key.id !== p));
			setPending(pending.filter((req) => req !== key.id));
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
			mounted: mounted.current,
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
		]
	);
	return <SwrPlusContext.Provider value={contextValue}>{children}</SwrPlusContext.Provider>;
};
