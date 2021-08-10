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
	}: // keepPreviousData = false,
	{
		onSuccess?: (_: any) => void;
		onError?: (_: any) => void;
		hideGlobalLoader?: boolean;
		hideGlobalError?: boolean;
		refetchOnMount?: boolean;
		keepPreviousData?: boolean;
	}
) => {
	// use them because these 4 states are local
	const [isResolved, setIsResolved] = useState(false);
	const [isPending, setIsPending] = useState(false);
	const [isValidating, setIsValidating] = useState(false);
	const keyResult = typeof key === 'function' ? key() : key;
	const actualKey = Array.isArray(keyResult) ? keyResult : [keyResult];
	const temp = useDeepCompareMemoize(actualKey);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const hash = useMemo(() => (keyResult ? stableValueHash(actualKey) : null), temp);
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
		const mounted = swrPlus.mounted[hash];
		if (!mounted) return;
		(async () => {
			const validating = swrPlus.validating;
			const pending = swrPlus.pending;
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
				await new Promise((resolve) => setTimeout(resolve, 2000));
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
	}, [hash, swrPlus.mounted]);
	const _isPending = useMemo(() => isPending && !!hash && swrPlus.pending.includes(hash), [hash, isPending, swrPlus.pending]);
	const _isValidating = useMemo(
		() => isValidating && !!hash && swrPlus.validating.includes(hash),
		[hash, isValidating, swrPlus.validating]
	);
	const fulfilled = useMemo(
		() => (isResolved && hash ? swrPlus.fulfilled.find((r) => r.id === hash) : null),
		[swrPlus.fulfilled, isResolved, hash]
	);
	const rejected = useMemo(
		() => (isResolved && hash ? swrPlus.rejected.find((r) => r.id === hash) : null),
		[hash, isResolved, swrPlus.rejected]
	);
	return {
		data: fulfilled?.data,
		error: rejected?.reason,
		isFulfilled: !!fulfilled,
		isRejected: !!rejected,
		isPending: _isPending,
		isValidating: _isValidating,
		isIdle: useMemo(
			() => !_isPending && !rejected && !fulfilled && !_isValidating,
			[_isPending, rejected, fulfilled, _isValidating]
		),
	};
};
