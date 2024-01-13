import { writable } from 'svelte/store';

export const localStore = (key: string) => {
	// receives the key of the local storage and an initial value

	// helper functions
	const toString = (value: any) => JSON.stringify(value, null, 2);
	const toObj = (value: any) => (value ? JSON.parse(value) : null);

	// convert to object
	const saved = toObj(localStorage.getItem(key));

	// create the underlying writable store
	const { subscribe, set, update } = writable(saved);
	return {
		subscribe,
		set: (value: any) => {
			// save also to local storage as a string
			if (value) localStorage.setItem(key, toString(value));

			return set(toObj(localStorage.getItem(key)));
		},
		update
	};
};