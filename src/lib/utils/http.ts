import { get as storeGet } from 'svelte/store';
import { authStore, loadingStore } from '../stores';
import { LECTIO_API } from '$lib/lectio';

export function reloadData(reload = true) {
	localStorage.setItem('nonce', Date.now().toString(36));
	if (reload) window.location.reload();
}

export async function get(endpoint: String, body: any = null) {
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

	const textResponse = await response.text();

	// Tjek om responsen er OK
	if (response.ok) {
		const performanceEntries = performance.getEntriesByType('resource');
		const entry = performanceEntries.find((entry) => entry.name === response.url);
		// @ts-ignore
		if (entry && entry.transferSize > 0) {
			const lectioCookie = response.headers.get('set-lectio-cookie');
			if (lectioCookie) authStore.update((store) => ({ ...store, cookie: lectioCookie }));
		}
		return JSON.parse(textResponse.replaceAll('\n', '  '));
	}

	return null;
}

export async function post(endpoint: String, body: Object) {
	const response = await get(endpoint, body);
	return response;
}
