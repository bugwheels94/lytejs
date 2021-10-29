import { useContext, useMemo, useEffect, useState, Reducer, useReducer } from 'react';
import { SwrPlusContext } from './provider';
import { stableValueHash, useDeepCompareMemoize } from './utils';


interface MyState {
	isError: any;
	isSuccess: boolean;
	isLoading: boolean;
	isFetching: boolean;
	isIdle: boolean
	data: any
}
export const useQuery = (
	key: any[] | (() => any[]),
	fetch: () => Promise<any>,
	{
		onSuccess = () => { },
		onError = () => { },
		hideGlobalLoader = false,
		hideGlobalError = false,
		refetchOnMount = false,
		initialData,
		staleTime = 0,
		select
	}: // keepPreviousData = false,
		{
			onSuccess?: (_: any) => void;
			onError?: (_: any) => void;
			hideGlobalLoader?: boolean;
			hideGlobalError?: boolean;
			refetchOnMount?: boolean;
			// keepPreviousData?: boolean;
			initialData?: any
			staleTime?: number,
			select?: (_: any) => any
		}
) => {
	const keyResult = typeof key === 'function' ? key() : key;
	const actualKey = Array.isArray(keyResult) ? keyResult : [keyResult];

	//["brands", "brandId"]
	const temp = useDeepCompareMemoize(actualKey);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const hash = useMemo(() => (keyResult ? stableValueHash(actualKey) : null), temp);
	const swrPlus = useContext(SwrPlusContext);
	const mounted = hash && swrPlus.mounted.current?.[hash];
	const promise = hash && swrPlus.promises.current?.[hash]
	const [counter, setCounter] = useState(0)
	// use them because these 4 states are local
	const [state, setState] = useReducer<Reducer<MyState, Partial<MyState>>>(
		(state, newState) => ({ ...state, ...newState }),
		{ isError: undefined, isSuccess: false, isLoading: !promise.data, isFetching: !!hash, data: initialData, isIdle: !hash }
	)
	useEffect(() => {
		hash && swrPlus.registerMount(hash, setState);
		hash && hideGlobalLoader && swrPlus.addToGlobalLoaderBlackList(hash);
		hash && hideGlobalError && swrPlus.addToGlobalErrorBlackList(hash);
		return () => {
			hash && hideGlobalError && swrPlus.removeFromGlobalErrorBlackList(hash);
			hash && hideGlobalLoader && swrPlus.removeFromGlobalLoaderBlackList(hash);
			hash && swrPlus.unregisterMount(hash, setState);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hash, hideGlobalError, hideGlobalLoader]);
	useEffect(() => {
		if (!hash) return;
		const mounted = swrPlus.mounted.current?.[hash];
		const promise = swrPlus.promises.current?.[hash];
		if (!mounted) return;
		(async () => {
			const validating = swrPlus.validating.current;
			const pending = swrPlus.pending.current;
			let existingPromise;
			// pending
			if (promise && !promise.data) {
				console.log("Already Pending")
				existingPromise = swrPlus.promises.current?.[hash];
				// setState({ isLoading: true });
			}
			//dedupe when existing request is in progress with data previous
			else if (promise && promise.data) {
				console.log("Already Fetching")
				existingPromise = swrPlus.promises.current?.[hash];
				setState({ isSuccess: true, data: promise.data });
			}
			// Mounting more request
			else if (mounted && mounted.length > 1) {
				swrPlus.registerValidating(hash);
				const promise = swrPlus.promises.current?.[hash];
				setState({ isSuccess: true, data: await promise.promise });
				if (!refetchOnMount) {
					console.log("Wont Refetch on Mount")
					existingPromise = promise
				}
			}
			else {
				setState({ isLoading: true });
				swrPlus.registerPending(hash);
			}
			try {
				if (!existingPromise) {
					mounted.forEach(s => s !== setCounter && s((t: number) => t + 1))
				}
				// select promise to check for stale/fresh
				const promise = swrPlus.promises.current?.[hash];
				let p, freshTill;
				if (existingPromise) {
					console.log('Existing')
					p = existingPromise;
					freshTill = existingPromise.freshTill
				} else if (promise?.freshTill > Date.now()) {
					console.log('Stale')
					p = promise
					freshTill = promise?.freshTill
				} else {
					console.log('New')
					p = { promise: fetch() }
					freshTill = Date.now() + (staleTime || 0)
				}
				if (swrPlus.promises.current) swrPlus.promises.current[hash] = {
					freshTill,
					promise: p,
				};
				const data = p.data ? p.data : await p.promise;
				// setData(data);
				if (swrPlus.promises.current) swrPlus.promises.current[hash] = {
					freshTill,
					promise: p,
					data
				};
				swrPlus.registerFulfilled({ id: hash, data });
				onSuccess(data);
				setState({ isLoading: false, isFetching: false, isSuccess: true, data });
			} catch (e) {

				// setError(e);
				onError(e);
				swrPlus.registerRejected({ id: hash, reason: e });
				setState({ isLoading: false, isFetching: false, isError: { reason: e } });
			}
		})();
	}, [hash, state.isFetching]);
	// const _isLoading = useMemo(() => isLoading && !!hash && swrPlus.pending.current?.includes(hash), [hash, isLoading, swrPlus.pending.current]);
	// const _isFetching = useMemo(
	// 	() => isFetching && !!hash && swrPlus.validating.current?.includes(hash),
	// 	[hash, isFetching, swrPlus.validating]
	// );
	// const rejected = useMemo(
	// 	() => (isError || isFetching && hash ? swrPlus.rejected.current?.find((r) => r.id === hash) : null),
	// 	[hash, isError, swrPlus.rejected.current, _isFetching]
	// );
	return {
		data: select && state.data ? select(state.data) : state.data,
		error: state.isError?.reason,
		isSuccess: state.isSuccess,
		isError: !!state.isError,
		isLoading: state.isLoading,
		isFetching: state.isFetching,
		isIdle: useMemo(
			() => !state.isLoading && !state.isError && !state.isSuccess && !state.isFetching,
			[state]
		),
	};
};
