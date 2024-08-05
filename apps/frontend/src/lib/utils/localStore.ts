// Source: https://github.com/joshnuss/svelte-local-storage-store
// https://github.com/joshnuss/svelte-local-storage-store/blob/master/index.ts
// Represents version v0.9.2 (18-04-2024)

import { writable as internal, type Writable } from 'svelte/store';

declare type Updater<T> = (value: T) => T;
declare type StoreDict<T> = { [key: string]: Writable<T> };

/* eslint-disable @typescript-eslint/no-explicit-any */
interface Stores {
	local: StoreDict<any>;
	session: StoreDict<any>;
}

const stores: Stores = {
	local: {},
	session: {}
};

export interface Serializer<T> {
	parse(text: string): T;
	stringify(object: T): string;
}

export type StorageType = 'local' | 'session';

export interface Options<T> {
	serializer?: Serializer<T>;
	storage?: StorageType;
	syncTabs?: boolean;
}

function getStorage(type: StorageType) {
	return type === 'local' ? localStorage : sessionStorage;
}

export function localStore<T>(key: string, initialValue: T, options?: Options<T>): Writable<T> {
	const serializer = options?.serializer ?? JSON;
	const storageType = options?.storage ?? 'local';
	const syncTabs = options?.syncTabs ?? true;
	const browser = typeof window !== 'undefined' && typeof document !== 'undefined';
	const storage = browser ? getStorage(storageType) : null;

	function updateStorage(key: string, value: T) {
		storage?.setItem(key, serializer.stringify(value));
	}

	function maybeLoadInitial(): T {
		const json = storage?.getItem(key);

		if (json && json !== 'undefined') {
			return <T>serializer.parse(json);
		}

		return initialValue;
	}

	if (!stores[storageType][key]) {
		const initial = maybeLoadInitial();
		const store = internal(initial, (set) => {
			if (browser && storageType == 'local' && syncTabs) {
				const handleStorage = (event: StorageEvent) => {
					if (event.key === key) {
						let newVal: any;
						newVal = event.newValue ? serializer.parse(event.newValue) : null;
						set(newVal);
					}
				};

				window.addEventListener('storage', handleStorage);

				return () => window.removeEventListener('storage', handleStorage);
			}
		});

		const { subscribe, set } = store;

		stores[storageType][key] = {
			set(value: T) {
				set(value);
				updateStorage(key, value);
			},
			update(callback: Updater<T>) {
				return store.update((last) => {
					const value = callback(last);

					updateStorage(key, value);

					return value;
				});
			},
			subscribe
		};
	}

	return stores[storageType][key];
}
