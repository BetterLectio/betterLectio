import { get } from './http.js';

export function holdOversætter(holdForkortet = '', holdArray = []) {
	// get the settings from localStorage
	const indstillinger = JSON.parse(localStorage.getItem('indstillinger'));
	if (!indstillinger.brugHoldOversætter) return holdForkortet;

	// return "Ukendt hold" if holdForkortet is null
	if (holdForkortet === null) return 'Ukendt hold';

	// return the name of the hold if the holdForkortet is found in the holdArray
	const fagObj = holdArray.find(hold => holdForkortet.toLowerCase().includes(hold.forkortelse.toLowerCase()));

	if (fagObj?.fag) return fagObj.fag;
	return holdForkortet;
}

export async function holdOversætterNy(holdId, fallback = 'Andet') {
	try {
		throw 'rate limiter fucker meget (fucker med check cookie (ikke en god ting))';
		const { fag } = await get(`/hold_til_fag?id=${holdId}`);
		return fag;
	} catch {
		return fallback;
	}
}
