import { get as storeGet } from 'svelte/store';
import { authStore, loadingStore } from '../stores';
import { LECTIO_API } from '$lib/lectio';

export function reloadData(reload = true) {
	localStorage.setItem('nonce', Date.now().toString(36));
	if (reload) window.location.reload();
}

export async function get(endpoint: string, body: any = null): Promise<any | false> {
	loadingStore.set(true);
	/* setTimeout(() => { //maybe not needed
		loadingStore.set(false);
	}, 5000); */
	let nonce = localStorage.getItem('nonce');
	if (nonce === null) {
		reloadData(false);
		nonce = localStorage.getItem('nonce');
	}

	// Fetch the data from the API
	let url = LECTIO_API + endpoint;
	if (url.indexOf('?') > -1) url += `&nonce=${nonce}`;
	else url += `?nonce=${nonce}`;

	const headers: HeadersInit = { 'lectio-cookie': storeGet(authStore).cookie || '' };
	const response =
		body === null
			? await fetch(url, { headers })
			: await fetch(url, {
				method: 'POST',
				headers: { ...headers, 'Content-Type': 'application/json' },
				body
			});
	loadingStore.set(false);

	const data = await response.json();

	// Tjek om responsen er OK
	if (response.ok) {
		const performanceEntries = performance.getEntriesByType('resource');
		const entry = performanceEntries.find((entry) => entry.name === response.url);

		// @ts-ignore
		if (entry && entry.transferSize > 0) {
			const lectioCookie = response.headers.get('set-lectio-cookie');
			if (lectioCookie) authStore.update((store) => ({ ...store, cookie: lectioCookie }));
		}
		return data;
	}

	return false;
}

export async function post(endpoint: string, body: Object) {
	const response = await get(endpoint, body);
	return response;
}
