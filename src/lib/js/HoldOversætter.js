import { get } from './http.js';

export function holdOversætter(holdForkortet = '', holdArray = []) {
	// get the settings from localStorage
	const indstillinger = JSON.parse(localStorage.getItem('indstillinger'));
	if (!indstillinger.brugHoldOversætter) return holdForkortet;

	// return "Ukendt hold" if holdForkortet is null
	if (holdForkortet === null) return 'Ukendt hold';

	// return the name of the hold if the holdForkortet is found in the holdArray
	const fagObj = JSON.stringify(holdArray.find(hold => holdForkortet.toLowerCase().includes(hold.forkortelse.toLowerCase())));

	if (fagObj === undefined) return holdForkortet;
	return JSON.parse(fagObj).fag;
}

export async function holdOversætterNy(holdId = '') {
	try {
		const { fag } = await get(`/hold_til_fag?id=${ holdId}`);
		return fag;
	} catch {
		return 'Andet';
	}
}
