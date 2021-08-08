import React, { useContext, useCallback, useMemo, useState, useEffect } from 'react';
import { SwrPlusContext } from './provider';
import { stableValueHash } from './utils';
type primitive = string | number | boolean;
interface obj {
	[s: string]: string | number | boolean | Array<obj> | undefined | obj;
}
type key = primitive | primitive[] | obj;
export const useMutation = (
	fetch: (...key: key[]) => Promise<any>,
	{
		key,
		onSuccess = () => {},
		onError = () => {},
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
	const [data, setData] = useState(undefined);
	const [error, setError] = useState(undefined);
	const [pending, setPending] = useState(false);
	const swrPlus = useContext(SwrPlusContext);
	const hash = useMemo(() => key && stableValueHash(key), key);
	useEffect(() => {
		hash && swrPlus.registerMount(hash);
		hash && hideGlobalLoader && swrPlus.addToGlobalLoaderBlackList(hash);
		hash && hideGlobalError && swrPlus.addToGlobalErrorBlackList(hash);
		return () => {
			hash && hideGlobalError && swrPlus.removeFromGlobalErrorBlackList(hash);
			hash && hideGlobalLoader && swrPlus.removeFromGlobalLoaderBlackList(hash);
			hash && swrPlus.unregisterMount(hash);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hash, hideGlobalError, hideGlobalLoader]);
	const isPending = useMemo(() => pending || (hash && swrPlus.pending.includes(hash)), [error, data]);
	const isFulfilled = useMemo(() => data !== undefined || (hash && swrPlus.fulfilled.find((r) => r.id === hash)), [data, hash]);
	const isRejected = useMemo(() => error !== undefined || (hash && !!swrPlus.rejected.find((r) => r.id === hash)), [error]);
	return {
		isFulfilled,
		isRejected,
		isPending,
		data,
		error,
		isIdle: useMemo(() => !isPending && !isRejected && !isFulfilled, []),
		mutate: useCallback(
			async (...v) => {
				setPending(true);
				hash && swrPlus.registerPending(hash);
				try {
					const data = await fetch(...v);
					setData(data);
					hash && swrPlus.registerFulfilled({ id: hash, data });
					onSuccess(data);
				} catch (e) {
					setError(e);
					onError(e);
					hash && swrPlus.registerRejected({ id: hash, reason: e });
				}
				setPending(false);
			},
			[hash]
		),
	};
};
