import { get as storeGet } from 'svelte/store';
import { authStore, connectionStore, loadingStore } from '../stores';
import { LECTIO_API } from '$lib/lectio';

export function reloadData(reload = true) {
	localStorage.setItem('nonce', Date.now().toString(36));
	if (reload) window.location.reload();
}

async function http(endpoint: string, body: any = null): Promise<any | false> {
	try {
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

		connectionStore.set(true);
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
	} catch (error) {
		if (error instanceof TypeError && error.message === 'NetworkError when attempting to fetch resource.') {
			connectionStore.set(false);
		} else {
			connectionStore.set(true);
			console.error(error);
		}
		loadingStore.set(false);
		return false;
	}
}

export async function get(endpoint: string, body: any = null): Promise<any | false> {
	let resp = await http(endpoint, body);
	if (resp) {
		return resp;
	}

	if (!storeGet(connectionStore)) {
		let tries = 0;
		const maxTries = 100; // Set the maximum number of tries set high on purpose
		while (tries < maxTries) {
			// retry until internet is connected
			console.info('[http] retrying request');
			resp = await http(endpoint, body);
			if (resp) {
				return resp;
			} else if (storeGet(connectionStore)) {
				return false; // internet is connected, but the request still failed
			}

			tries++;
			await new Promise((r) => setTimeout(r, 1000)); // wait for 1 second
		}

		return false; // internet is not connected and maxTries is reached, so let page deal with it
	}
}
