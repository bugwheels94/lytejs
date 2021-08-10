import React, { useContext, useMemo, useEffect, DependencyList, useState } from 'react';
import { SwrPlusContext } from './provider';
import { dequal } from 'dequal/lite';
import { stableValueHash } from './utils';

function useDeepCompareMemoize(value: DependencyList) {
	const ref = React.useRef<DependencyList>();
	const signalRef = React.useRef<number>(0);

	if (!dequal(value, ref.current)) {
		ref.current = value;
		signalRef.current += 1;
	}

	return [signalRef.current];
}
export const useQuery = (
	key: any[] | (() => any[]),
	fetch: () => Promise<any>,
	{
		onSuccess = () => {},
		onError = () => {},
		hideGlobalLoader = false,
		hideGlobalError = false,
		refetchOnMount = false,
		keepPreviousData = false,
	}: {
		onSuccess?: (_: any) => void;
		onError?: (_: any) => void;
		hideGlobalLoader?: boolean;
		hideGlobalError?: boolean;
		refetchOnMount?: boolean;
		keepPreviousData?: true;
	}
) => {
	// use them because these 4 states are local
	const [isResolved, setIsResolved] = useState(false);
	const [isPending, setIsPending] = useState(false);
	const [isValidating, setIsValidating] = useState(false);
	const keyResult = typeof key === 'function' ? key() : key;
	const actualKey = Array.isArray(keyResult) ? keyResult : [keyResult];
	const hash = useMemo(() => (keyResult ? stableValueHash(actualKey) : null), useDeepCompareMemoize(actualKey));
	const swrPlus = useContext(SwrPlusContext);
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
	useEffect(() => {
		if (!hash) return;
		(async () => {
			const mounted = swrPlus.mounted[hash];
			const { pending, validating } = swrPlus;
			if (pending.includes(hash)) {
				setIsPending(true);
				return;
			}
			if (validating.includes(hash)) {
				setIsValidating(true);
				return;
			}
			if (mounted && mounted > 1) {
				setIsValidating(true);
				swrPlus.registerValidating(hash);
				if (!refetchOnMount) {
					setIsResolved(true);
				}
			} else {
				setIsPending(true);
				swrPlus.registerPending(hash);
			}
			try {
				const data = await fetch();
				// setData(data);
				onSuccess(data);
				hash && swrPlus.registerFulfilled({ id: hash, data });
				setIsResolved(true);
			} catch (e) {
				// setError(e);
				onError(e);
				swrPlus.registerRejected({ id: hash, reason: e });
				setIsResolved(true);
			}
		})();
	}, [hash]);
	const _isPending = useMemo(() => isPending && !!hash && swrPlus.pending.includes(hash), [swrPlus.pending]);
	const _isValidating = useMemo(() => isValidating && !!hash && swrPlus.validating.includes(hash), [swrPlus.validating]);
	const fulfilled = useMemo(
		() => (isResolved && hash ? swrPlus.fulfilled.find((r) => r.id === hash) : null),
		[swrPlus.fulfilled]
	);
	const rejected = useMemo(() => (isResolved && hash ? swrPlus.rejected.find((r) => r.id === hash) : null), [swrPlus.rejected]);
	return {
		data: fulfilled?.data,
		error: rejected?.reason,
		isFulfilled: !!fulfilled,
		isRejected: !!rejected,
		isPending: _isPending,
		isValidating: _isValidating,
		isIdle: useMemo(() => !isPending && !rejected && !fulfilled, []),
	};
};
