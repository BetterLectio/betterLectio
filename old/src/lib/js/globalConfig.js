import { get, post } from '$lib/js/http.js';
import { cookieInfo } from '$lib/js/LectioCookieHandler';
import { writable } from 'svelte/store';

let configNonce = Date.now().toString(36);
let betlecMappeId = null;
let betlecConfigId = null;

async function setConfig(value, overwrite = true) {
	console.log('Opdaterer config filen');
	const body = {
		fileName: 'config.json',
		folderId: betlecMappeId,
		contentType: 'application/json',
		content: JSON.stringify(value),
		fileComment: 'Denne fil er autogenereret af BetterLectio. Hvis du fjerner den kan du risikere at alle dine indstillinger på BetterLectio fjernes.',
		public: false
	};
	if (overwrite) body.documentId = betlecConfigId;
	await post('/dokument_upload', JSON.stringify(body));
}

const writableConfig = () => {
	const { subscribe, set, update } = writable(undefined);

	return {
		subscribe,
		set: value => {
			if (value) setConfig(value);
			return set(value);
		},
		update
	};
};
export const config = writableConfig();

async function getConfig() {
	configNonce = await Date.now().toString(36);
	if (!betlecMappeId) {
		const user = await cookieInfo();
		const dokumenter = await get(`/dokumenter?folderid=S${user.userId}__&nonce=${configNonce}`);
		const betlecMappe = dokumenter.indhold.filter(dokument => dokument.navn === '.betterlectio');
		if (betlecMappe.length > 0) {
			betlecMappeId = betlecMappe[0].id;
		} else {
			console.log('Opretter mappen');
			await post('/opret_mappe', JSON.stringify({
				folderName: '.betterlectio',
				folderComment: 'Denne mappe er autogenereret af BetterLectio. Hvis du fjerner den kan du risikere at alle dine indstillinger, themes og plugins på BetterLectio fjernes.',
				folderId: `S${user.userId}__`
			}));
			getConfig();
			return;
		}
	}

	const betlecMappeDokumenter = await get(`/dokumenter?folderid=${betlecMappeId}&nonce=${configNonce}`);
	const _betlecConfigId = betlecMappeDokumenter.indhold.filter(dokument => dokument.navn === 'config.json');
	if (_betlecConfigId.length > 0) {
		betlecConfigId = _betlecConfigId[0].id;
		console.log(betlecConfigId);
	} else {
		console.log('Opretter config fil');
		await setConfig({}, false);
		getConfig();
		return;
	}

	config.set(await get(`/dokument_hent?id=${betlecConfigId}&configNonce=${configNonce}`));
}
getConfig();
