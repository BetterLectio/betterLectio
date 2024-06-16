import type { Writable } from 'svelte/store';
import { localStore } from '$lib/utils/localStore';
import { get } from '$lib/utils/http';

export function lectioDataStore<T>(endpoint: string, key: string, initialValue: T): Writable<T> & {
	fetch: () => Promise<boolean>
} {
	const store = localStore(key, initialValue);

	return {
		...store,
		fetch: async () => {
			const data = await get(endpoint);
			if (!data) return false;
			store.set(data as T);
			return true;
		}
	};
}