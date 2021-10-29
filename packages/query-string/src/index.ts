interface obj {
	[s: string]: string | number | boolean | Array<obj> | undefined | obj;
}
export const stringify = (params: obj) =>
	Object.keys(params)
		.map((k) => {
			const current = params[k];
			if (current === undefined) return `${k}=`;
			if (Array.isArray(current)) {
				if (current.length === 0) return `${k}=`;
				return current
					.map((param) => `${k}[]=${encodeURIComponent(typeof param === 'object' ? JSON.stringify(param) : param)}`)
					.join('&');
			}
			return `${k}=${encodeURIComponent(typeof current === 'object' ? JSON.stringify(current) : current)}`;
		})
		.join('&');

export const parse = (query: string = '') => {
	const trimQuery = query.replace(/^\?/, '');
	const queries = trimQuery.split('&').map((query) => query.split('='));
	const initial: {
		[key: string]: any;
	} = {};
	if (!trimQuery) return initial;
	return queries.reduce((acc, query) => {
		if (!query[1] || !query[0]) return acc;
		const decoded = decodeURIComponent(query[1]);
		let finalValue = decoded;
		if (decoded[0] === '{' || decoded[0] === '[') {
			try {
				finalValue = JSON.parse(decoded);
			} catch (e) {}
		}
		if (query[0].endsWith('[]')) {
			const key = query[0].slice(0, -2);
			acc[key] = acc[key] || [];
			acc[key].push(finalValue);
		} else acc[query[0]] = finalValue;
		return acc;
	}, initial);
};
