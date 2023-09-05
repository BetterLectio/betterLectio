import { addNotification } from '$lib/js/notifyStore.js';

// async function sha256(str) {
//   const buf = await crypto.subtle.digest("SHA-256", new TextEncoder("utf-8").encode(str));
//   return Array.prototype.map.call(new Uint8Array(buf), (x) => ("00" + x.toString(16)).slice(-2)).join("");
// }

// const customUUID = sha256(
//   JSON.parse(Buffer.from(localStorage.getItem("authentication"), "base64").toString("ascii"))
//     .LastLoginUserName
// );

export const api
	= window.electron || window.navigator.userAgent.includes('BetterLectio Mobile') ? 'http://localhost:5000' : 'https://api.betterlectio.dk';

export function reloadData(reload = true) {
	localStorage.setItem('nonce', Date.now().toString(36));
	if (reload) window.location.reload();
}

async function checkCookieValidity() {
	const cookieValidationCheck = await fetch(`${api}/check-cookie`, { headers: { 'lectio-cookie': localStorage.getItem('lectio-cookie') } });
	const { valid: isCookieValid } = await cookieValidationCheck.json();

	return {
		isCookieValid,
		lectioCookie: cookieValidationCheck.headers.get('set-lectio-cookie')
	};
}

export async function get(endpoint) {
	// FIXME: code does not work
	// Wait until the user is authenticated
	// while (true) {
	// try {
	// localStorage.getItem('lectio-cookie');
	// window.location.href;
	// break;
	// } catch (err) {}
	// await new Promise(resolve => setTimeout(resolve, 10));
	// }

	// If the user is not authenticated, redirect to the auth page
	if (localStorage.getItem('lectio-cookie') === null) {
		console.log('No cookie, redirecting to auth page');
		const transformedLink = encodeURIComponent(window.location.href);
		window.location.href = `/auth?redirect=${transformedLink}`;
	}

	let nonce = localStorage.getItem('nonce');
	if (nonce === null) {
		reloadData(false);
		nonce = localStorage.getItem('nonce');
	}

	// Fetch the data from the API
	let url = api + endpoint;
	if (url.indexOf('?') > -1) url += `&nonce=${nonce}`;
	else url += `?nonce=${nonce}`;

	const start = performance.now();
	const response = await fetch(url, { headers: { 'lectio-cookie': localStorage.getItem('lectio-cookie') } });
	const stop = performance.now();

	const textResponse = await response.text();

	// Tjek om responsen er OK
	if (response.ok) {
		if (stop - start > 100) {
			// Dette gøres for at tjekke om responset er cached.
			// Vi skal finde en bedre måde at gøre det på.
			// Et eksempel kunne være https://developer.mozilla.org/en-US/docs/Web/API/PerformanceResourceTiming/transferSize
			// da transferSize er lig med 0 hvis den er cached men det er ikke understøttet på safari
			const lectioCookie = response.headers.get('set-lectio-cookie');
			if (lectioCookie) localStorage.setItem('lectio-cookie', lectioCookie);
		}
		return JSON.parse(textResponse.replaceAll('\n', '  '));
	}

	// Responsen er ikke OK, derfor validerer vi om det var en fejl med requesten,
	// eller om vores cookie er udløbet/ikke valid
	const { isCookieValid, lectioCookie } = await checkCookieValidity();

	if (isCookieValid) {
		if (lectioCookie !== null) localStorage.setItem('lectio-cookie', lectioCookie);

		console.error(`Error fetching data from ${api}${endpoint}`,
			'\n\nrequest response:',
			response,
			'\n\nrequest response body:',
			textResponse);
	} else {
		console.log('Cookie not valid, redirecting to auth page.');
		addNotification('Din session er ugyldig, omdirigerer til login-side', 'alert-error');

		const transformedLink = encodeURIComponent(window.location.href);
		window.location.href = `/auth?redirect=${transformedLink}`;
	}

	return null;
}
