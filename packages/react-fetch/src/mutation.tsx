import React, { useContext, useCallback, useMemo, useEffect, Reducer, useReducer } from 'react';
import { SwrPlusContext } from './provider';
import { stableValueHash, useDeepCompareMemoize } from './utils';
type primitive = string | number | boolean;
interface obj {
	[s: string]: string | number | boolean | Array<obj> | undefined | obj;
}
type key = primitive | primitive[] | obj;

let idCounter = 0

interface MyState {
	isError: any;
	isSuccess: boolean;
	isLoading: boolean;
	data: any
}
const intialState: MyState = { isError: undefined, isSuccess: false, isLoading: false, data: undefined }
export const useMutation = (
	fetch: (...key: key[]) => Promise<any>,
	{
		key,
		onSuccess = () => { },
		onError = () => { },
		hideGlobalLoader = false,
		hideGlobalError = false,
	}: {
		key?: React.DependencyList;
		onSuccess?: (_: any) => void;
		onError?: (_: any) => void;
		hideGlobalLoader?: boolean;
		hideGlobalError?: boolean;
	}
) => {
	const [state, setState] = useReducer<Reducer<MyState, Partial<MyState>>>(
		(state, newState) => ({ ...state, ...newState }),
		intialState
	)

	const swrPlus = useContext(SwrPlusContext);
	const temp = useDeepCompareMemoize(key || []);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const hash = useMemo(() => (key ? stableValueHash(key) : '' + idCounter++), temp);
	useEffect(() => {
		swrPlus.registerMount(hash, setState);
		hideGlobalLoader && swrPlus.addToGlobalLoaderBlackList(hash);
		hideGlobalError && swrPlus.addToGlobalErrorBlackList(hash);
		return () => {
			hideGlobalError && swrPlus.removeFromGlobalErrorBlackList(hash);
			hideGlobalLoader && swrPlus.removeFromGlobalLoaderBlackList(hash);
			swrPlus.unregisterMount(hash, setState);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hash, hideGlobalError, hideGlobalLoader]);
	useEffect(() => {
		if (!state.isLoading) return
		(async () => {
			try {
				const promise = swrPlus.promises.current?.[hash]?.promise
				if (swrPlus.promises.current) swrPlus.promises.current[hash] = {
					promise,
				};
				const data = await promise;
				setState({ isLoading: false, isSuccess: true, data });
				onSuccess(data);
			} catch (e) {
				setState({ isLoading: false, isError: { reason: e } });
				onError(e);
				swrPlus.registerRejected({ id: hash, reason: e });
			}
			delete swrPlus.promises.current?.[hash]

		})()
	}, [fetch, hash, onError, onSuccess, state.isLoading, swrPlus])
	return {
		isSuccess: state.isSuccess,
		isError: !!state.isError,
		isPending: state.isLoading,
		data: state.data,
		error: state.isError?.reason,
		isIdle: useMemo(() => !state.isLoading && !state.isError && !state.isSuccess, []),
		mutate: useCallback(
			async (...v) => {
				if (state.isLoading) return
				const mounted = swrPlus.mounted.current?.[hash];
				const promise = fetch(...v)
				if (swrPlus.promises.current) swrPlus.promises.current[hash] = {
					promise,
				};
				if (!mounted) return;

				mounted.forEach(s => s({ isError: undefined, isSuccess: false, isLoading: true, data: undefined }))
			},
			[fetch, hash, state.isLoading, swrPlus.mounted, swrPlus.promises]
		),
	};
};
