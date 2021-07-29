export const wsRouter = (ws: WebSocket) => {
	return ws;
	// const promiseStore = {};
	// const onGetStore = {};
	// const onPostStore = {};
	// let unique = 0;
	// const object = {
	// 	client: {
	// 		get: (name, options) => {
	// 			unique += 1;
	// 			ws.send(JSON.stringify({ get: name, id: unique, options }));
	// 			return new Promise((resolve, reject) => {
	// 				promiseStore[unique] = { resolve, reject };
	// 			});
	// 		},
	// 		post: (name, options) => {
	// 			unique += 1;
	// 			ws.send(JSON.stringify({ post: name, id: unique, options }));
	// 			return new Promise((resolve, reject) => {
	// 				promiseStore[unique] = { resolve, reject };
	// 			});
	// 		},
	// 	},
	// 	router: {
	// 		get: (name, ...callback) => {
	// 			onGetStore[name] = callback;
	// 		},
	// 		post: (name, ...callback) => {
	// 			onPostStore[name] = callback;
	// 		},
	// 	},
	// 	onConnect: (cb) => {
	// 		if (ws.readyState === WebSocket.OPEN) return cb();
	// 		ws.addEventListener('open', cb);
	// 	},
	// };
	// ws.onmessage = async ({ data: event }) => {
	// 	const message = JSON.parse(event);
	// 	if (message._id) {
	// 		if (!message.error) {
	// 			promiseStore[message._id].resolve(message?.response);
	// 		} else if (message.error) {
	// 			promiseStore[message._id].reject(message.error);
	// 		}
	// 		delete promiseStore[message.unique];
	// 		return;
	// 	}
	// 	let store;
	// 	let method;
	// 	if (message.get) {
	// 		store = onGetStore;
	// 		method = 'get';
	// 	} else {
	// 		method = 'post';
	// 		store = onPostStore;
	// 	}
	// 	const callbacks = store[message[method]];
	// 	const scope = {};
	// 	let result;
	// 	if (callbacks) {
	// 		try {
	// 			for (let i = 0; i < callbacks.length; i += 1) {
	// 				result = await callbacks[i](message.options, scope);
	// 				if (result !== undefined) break;
	// 			}
	// 			if (result !== null) ws.send(JSON.stringify({ _id: message.id, response: result }));
	// 		} catch (error) {
	// 			console.log(error);
	// 			ws.send(JSON.stringify({ _id: message.id, error }));
	// 		}
	// 	}
	// };
	// return object;
};
