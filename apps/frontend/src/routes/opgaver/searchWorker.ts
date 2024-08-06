import fuzzy from 'fuzzy';
import type { RawSimpleAssignment } from '$lib/types/assignments';

self.onmessage = (event) => {
	const { opgaver, searchString, status } = event.data;

	let filteredOpgaver = opgaver.filter((opgave: RawSimpleAssignment) => {
		switch (status) {
			case 'Alle':
				return true;
			case 'Skal Afleveres':
				return opgave.status === 'Venter' || opgave.status === 'Mangler';
			case 'Er Afleveret':
				return opgave.status === 'Afleveret' || opgave.status === 'Afsluttet';
		}
	});

	if (searchString) {
		filteredOpgaver = filteredOpgaver.filter((opgave: RawSimpleAssignment) => {
			const titleMatch = fuzzy.match(searchString.toLowerCase(), opgave.opgavetitel.toLowerCase());
			const holdMatch = fuzzy.match(searchString.toLowerCase(), opgave.hold.toLowerCase());
			return titleMatch || holdMatch;
		});
	}

	self.postMessage(filteredOpgaver);
};
