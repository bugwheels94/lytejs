import React, { ReactNode, useCallback, useMemo, useState } from 'react';
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
	const [mounted, setMounted] = useState<Record<string, number>>({});
	const [store, setStore] = useState<Record<string, any>>({});
	const [pending, setPending] = useState<string[]>([]);
	const [validating, setValidating] = useState<string[]>([]);
	const [fulfilled, setFulfilled] = useState<fulfilled[]>([]);
	const [rejected, setRejected] = useState<{ id: string; reason: string }[]>([]);
	const [globalLoaderBlackList, setGlobalLoaderBlackList] = useState({});
	const [globalErrorBlackList, setGlobalErrorBlackList] = useState({});
	const registerMount = useCallback(
		(key: string) => {
			mounted[key] = (mounted[key] || 0) + 1;
			setMounted(mounted);
		},
		[mounted]
	);

	const unregisterMount = useCallback(
		(key: string) => {
			const result = mounted[key];
			if (!result) return;
			if (result > 1) mounted[key] = result - 1;
			else {
				delete mounted[key];
				reset(key);
			}
			setMounted(mounted);
		},
		[mounted]
	);
	const registerPending = useCallback((key: string) => {
		if (!mounted[key]) return; // halt if the component unmounted in mid of the API call
		setRejected(rejected.filter((r) => key !== r.id));
		setFulfilled(fulfilled.filter(({ id }) => key !== id));
		setPending(pending.concat(key));
	}, []);
	const registerValidating = useCallback((key: string) => {
		if (!mounted[key]) return; // halt if the component unmounted in mid of the API call
		setValidating(pending.concat(key));
	}, []);
	const registerRejected = useCallback((key: { id: string; reason: string }) => {
		if (!mounted[key.id]) return; // halt if the component unmounted in mid of the API call
		setRejected([key, ...rejected]);
		setValidating(validating.filter((p) => key.id !== p));
		setPending(pending.filter((req) => req !== key.id));
	}, []);
	const registerFulfilled = useCallback((key: fulfilled) => {
		if (!mounted[key.id]) return; // halt if the component unmounted in mid of the API call
		setFulfilled([key, ...fulfilled]);
		setValidating(validating.filter((p) => key.id !== p));
		setPending(pending.filter((req) => req !== key.id));
	}, []);
	const reset = useCallback((key: string) => {
		setFulfilled(fulfilled.filter(({ id }) => key !== id));
		setPending(pending.filter((p) => key !== p));
		setValidating(validating.filter((p) => key !== p));
		setRejected(rejected.filter((r) => key !== r.id));
	}, []);
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
			setStore,
			validating,
			registerValidating,
		}),
		[]
	);
	return <SwrPlusContext.Provider value={contextValue}>{children}</SwrPlusContext.Provider>;
};
