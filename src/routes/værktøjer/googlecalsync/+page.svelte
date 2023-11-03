<script>
	import CryptoJS from 'crypto-es';
	import { cookieInfo } from '$lib/js/LectioCookieHandler.js';
	import { get } from '$lib/js/http.js';
	import { goto } from '$app/navigation';

	let cookie = null;
	cookieInfo().then(cookieData => {
		cookie = cookieData;
	});

	let tokenClient = null;
	let gApiInitialized = false;
	let gIsInitialized = false;

	let loggedin = false;
	const responseObj = {};
	let turn = 0;

	$: isModulerSynced = true;
	$: isOpgaverSynced = false;

	// if one is true, the other is false

	// weeknr = url param "week"
	let weeknr = new URLSearchParams(window.location.search).get('week');

	$: if (weeknr) console.log(weeknr);

	// flyt til .env eller pin kode indtastning eller noget ¯\_(ツ)_/¯
	const secretKey = 'meget hemmelig nøgle';

	function handleAutoAuth() {
		const ciphertext = localStorage.getItem('G-apitoken');
		if (ciphertext === null) return;

		const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
		const token = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

		console.log('handleAutoAuth');

		// see if token is expired
		if (token !== null && token.expiresAt < Date.now()) {
			loggedin = false;
			localStorage.removeItem('G-apitoken');
			return;
		}
		if (token !== null) {
			window.gapi.client.setToken(token);
			loggedin = true;
			turn = 2;
		}
	}

	const start = async() => {
		const CLIENT_ID = '24684948206-14gdudquegcmmekdkfk2ud0isq4i2bnj.apps.googleusercontent.com';
		const API_KEY = 'AIzaSyDW02jMJFpHyJuvHG_IgXAvJQsnqy0EWiQ';
		const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest', 'https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest'];
		const SCOPES = 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/tasks';

		// document.getElementById('authorize_button').style.visibility = 'hidden';
		// document.getElementById('signout_button').style.visibility = 'hidden';

		await window.gapi.client.init({
			apiKey: API_KEY,
			discoveryDocs: DISCOVERY_DOCS
		});
		gApiInitialized = true;
		tokenClient = window.google.accounts.oauth2.initTokenClient({
			// eslint-disable-next-line camelcase
			client_id: CLIENT_ID,
			scope: SCOPES,

			// defined later
			callback: ''
		});
		gIsInitialized = true;

		// if (gApiInitialized && gIsInitialized) document.getElementById('authorize_button').style.visibility = 'visible';
		if (gApiInitialized && gIsInitialized) turn = 1;

		handleAutoAuth();
	};

	const initializeGapi = () => {
		window.gapi.load('client', start);
	};

	function handleAuthClick() {
		document.getElementById('authorize_button').classList.add('btn-disabled');
		tokenClient.callback = response => {
			console.log(response);
			if (response.error !== undefined) {
				document.getElementById('authorize_button').classList.remove('btn-disabled');
				throw response;
			}
			loggedin = true;

			// save token to localstorage
			const ciphertext = CryptoJS.AES.encrypt(JSON.stringify({ ...window.gapi.client.getToken(), expiresAt: Date.now() + 3600000 }),
				secretKey).toString();
			localStorage.setItem('G-apitoken', ciphertext);
		};

		if (window.gapi.client.getToken() === null) {
			// Prompt the user to select a Google Account and ask for consent to share their data
			// when establishing a new session.
			tokenClient.requestAccessToken({ prompt: 'consent' });
		} else {
			// Skip display of account chooser and consent dialog for an existing session.
			tokenClient.requestAccessToken({ prompt: '' });
		}

		// add focus event listener to the window
		window.addEventListener('focus', () => {
			document.getElementById('authorize_button').classList.remove('btn-disabled');
			if (loggedin) {
				turn = 2;

				// remove focus event listener
				// eslint-disable-next-line no-empty-function
				window.removeEventListener('focus', () => {});
			}
		});
	}

	function handleSignoutClick() {
		// remove token from localstorage
		localStorage.removeItem('G-apitoken');

		const token = window.gapi.client.getToken();
		if (token !== null) {
			window.google.accounts.oauth2.revoke(token.access_token);
			window.gapi.client.setToken('');
			document.getElementById('authorize_button').innerText = 'Log ind';
			document.getElementById('signout_button').style.visibility = 'hidden';
			loggedin = false;
		}
	}

	function createEvent(modul) {
		const event = {
			summary: modul.hold,
			id: `betterlectio${modul.absid }at${new Date().getUTCMilliseconds() + new Date().getUTCSeconds()}`,
			description: modul.linkToLectio,
			start: {
				dateTime: modul.googleStart,
				timeZone: 'Europe/Copenhagen'
			},
			end: {
				dateTime: modul.googleEnd,
				timeZone: 'Europe/Copenhagen'
			},
			location: modul.googleLocation,
			reminders: {
				useDefault: false,
				overrides: [
					{ method: 'popup', minutes: 5 }
				]
			}
		};
		return event;
	}

	function convertLectioTime(dateString) {
		const [startDateString, endDateString] = dateString.split(' til ');
		const [startDay, startMonth, startYear, startHour, startMinute] = startDateString.match(/\d+/gu);
		const [endHour, endMinute] = endDateString.match(/\d+/gu);

		// month is 0-indexed
		const startDate = new Date(startYear, startMonth - 1, startDay, startHour, startMinute, 0);

		// month is 0-indexed
		const endDate = new Date(startYear, startMonth - 1, startDay, endHour, endMinute, 0);

		const formattedStartDate = startDate.toISOString();
		const formattedEndDate = endDate.toISOString();
		return [formattedStartDate, formattedEndDate];
	}

	function convertLectioTimeSingle(dateString) {
		const [startDay, startMonth, startYear, startHour, startMinute] = dateString.match(/\d+/gu);

		// month is 0-indexed
		const startDate = new Date(startYear, startMonth - 1, startDay, startHour, startMinute, 0);

		const formattedStartDate = startDate.toISOString();
		return formattedStartDate;
	}

	function formatModuler(moduler) {
		const events = [];
		moduler.forEach(modul => {
			const [startDate, endDate] = convertLectioTime(modul.tidspunkt);

			// create event does additonal processing of the event
			events.push(createEvent({
				...modul,
				googleStart: startDate,
				googleEnd: endDate,
				linkToLectio: `https://app.betterlectio.dk/modul?absid=${ modul.absid}`,
				googleLocation: modul.lokale
			}));
		});
		return events;
	}

	function formatOpgaver(opgaver) {
		const tasks = [];
		opgaver.forEach(opgave => {
			const dueDate = convertLectioTimeSingle(opgave.frist);
			tasks.push({
				kind: 'tasks#task',
				etag: `betlec${opgave.exerciseid }`,
				title: opgave.opgavetitel,
				updated: new Date().toDateString(),
				notes: `${opgave.opgavenote === '' ? 'ingen opgavenote' : opgave.opgavenote }\nlink: https://app.betterlectio.dk/opgave?exerciseid=${opgave.exerciseid}\n\nikke slet (betterlectio${ opgave.exerciseid})`,
				status: opgave.status === 'Venter' ? 'needsAction' : 'completed',
				due: dueDate,
				completed: opgave.status === 'Afleveret' ? opgave.dueDate : null,
				deleted: false,
				hidden: false
			});
		});
		return tasks;
	}

	async function pushEvents(events) {
		const batch = window.gapi.client.newBatch();
		events.forEach(event => {
			batch.add(window.gapi.client.calendar.events.insert({ calendarId: 'primary', resource: event }));
		});
		await batch.then(response => {
			console.log(response.result);
		}).catch(err => {
			console.error(err);
		});
	}

	async function pushTasks(tasks) {
		let _tasks = tasks;
		if (tasks.length > 50) _tasks = tasks.slice(-50);

		const batch = window.gapi.client.newBatch();
		_tasks.forEach(task => {
			batch.add(window.gapi.client.tasks.tasks.insert({ tasklist: '@default', resource: task }));
		});
		await batch.then(response => {
			console.log(response.result);
		}).catch(err => {
			console.error(err);
		});
	}

	async function removeOldEvents(weekNumber) {
		// get the list of events from the calendar for that week
		const year = new Date().getFullYear();
		const startOfWeek = new Date(year, 0, 1 + (weekNumber - 1) * 7);
		const endOfWeek = new Date(year, 0, 1 + (weekNumber - 1) * 7 + 6);
		const response = await window.gapi.client.calendar.events.list({
			calendarId: 'primary',
			timeMin: startOfWeek.toISOString(),
			timeMax: endOfWeek.toISOString(),
			singleEvents: true,
			orderBy: 'startTime',
			maxResults: 1000
		});
		const { items } = response.result;
		const betterlectioEvents = items.filter(item => item.id.startsWith('betterlectio'));

		if (betterlectioEvents.length === 0) return;

		console.log(`removing ${betterlectioEvents.length} old events ahead of sync`);
		const batch = window.gapi.client.newBatch();
		betterlectioEvents.forEach(event => {
			batch.add(window.gapi.client.calendar.events.delete({ calendarId: 'primary', eventId: event.id }));
		});
		await batch.then(response => {
			console.log(response.result);
		}).catch(err => {
			console.error(err);
		});
	}

	async function removeOldTasks() {
		// get the list of events from the calendar for that week
		const response = await window.gapi.client.tasks.tasks.list({
			tasklist: '@default',
			showCompleted: true,
			showHidden: true,
			showDeleted: false,
			maxResults: 10000
		});
		const { items } = response.result;
		console.log(items);
		const betterlectioTasks = items.filter(item => {
			if (item.notes === undefined) return false;
			return item.notes.includes('betterlectio');
		});
		console.log(betterlectioTasks);

		if (betterlectioTasks.length === 0) return;

		console.log(`removing ${betterlectioTasks.length} old tasks ahead of sync`);
		const batch = window.gapi.client.newBatch();
		betterlectioTasks.forEach(task => {
			batch.add(window.gapi.client.tasks.tasks.delete({ tasklist: '@default', task: task.id }));
		});
		await batch.then(response => {
			console.log(response.result);
		}).catch(err => {
			console.error(err);
		});
	}

	let skemaLoaded = false;
	let opgaverLoaded = false;
	let SyncLoaded = false;

	async function getSkema(weekNumber) {
		const year = new Date().getFullYear();
		const skema = await get(`/skema?id=${`S${cookie.userId}`}&uge=${weekNumber}&år=${year}`);
		const { moduler } = skema;
		skemaLoaded = true;
		return moduler;
	}

	async function getOpgaver() {
		const opgaver = await get('/opgaver');
		opgaverLoaded = true;
		return opgaver;
	}
	async function sync() {
		const start = Date.now();
		const [moduler, opgaver] = await Promise.all([getSkema(weeknr), getOpgaver()]);
		console.log(opgaver);
		if (isModulerSynced) {
			console.log(`time to fetch moduler: ${Date.now() - start}ms`);
			const events = formatModuler(moduler);
			await removeOldEvents(weeknr);
			await pushEvents(events);
			console.log(`time to sync events: ${Date.now() - start}ms`);
		}
		if (isOpgaverSynced) {
			console.log(`time to fetch opgaver: ${Date.now() - start}ms`);
			const tasks = formatOpgaver(opgaver);
			await removeOldTasks();
			await pushTasks(tasks);
			console.log(`time to sync tasks: ${Date.now() - start}ms`);
		}

		SyncLoaded = true;
		turn = 5;
	}

</script>

<svelte:head>
	<script src="https://accounts.google.com/gsi/client"></script>
	<script src="https://apis.google.com/js/api.js" on:load={initializeGapi}></script>
</svelte:head>

<h1 class="heading">Google Kalender-synkronisering</h1>
<div class="join join-vertical w-full">
	<div class="collapse {turn === 0 ? 'collapse-open' : 'collapse-close'} join-item border border-base-300">
		<input type="radio" name="my-accordion-4" checked="checked" />
		<div class="collapse-title text-xl font-bold flex flex-row justify-between">
			<div>
				Klargører synkronisering
			</div>
			{#if turn > 0}
				<div class="flex">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-check-circle-fill justify-center" viewBox="0 0 16 16">
						<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
					</svg>
				</div>
			{/if}
		</div>
		<div class="collapse-content">
			<div class="loading-spinner loading"></div>
		</div>
	</div>
	<div class="collapse {turn === 1 ? 'collapse-open' : 'collapse-close'} join-item border border-base-300">
		<input type="radio" name="my-accordion-4" checked="checked" />
		<div class="collapse-title text-xl font-bold flex flex-row justify-between">
			<div>
				Log ind med Google
			</div>
			{#if turn > 1}
				<div class="flex">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-check-circle-fill justify-center" viewBox="0 0 16 16">
						<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
					</svg>
				</div>
			{/if}
		</div>
		<div class="collapse-content">
			<div>
				<button class="btn btn-sm" id="authorize_button" on:click={handleAuthClick}>Log ind</button>
			</div>
		</div>
	</div>
	<div class="collapse {turn === 2 ? 'collapse-open' : 'collapse-close'} join-item border border-base-300">
		<input type="radio" name="my-accordion-4" checked="checked" />
		<div class="collapse-title text-xl font-bold flex flex-row justify-between">
			<div>
				Vælg hvad der skal synkroniseres
			</div>
			{#if turn > 2}
				<div class="flex">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-check-circle-fill justify-center" viewBox="0 0 16 16">
						<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
					</svg>
				</div>
			{/if}
		</div>
		<div class="collapse-content">
			<div class="w-80 p-4 rounded-xl bg-base-200">
				<div class="form-control">
					<label class="label cursor-pointer">
						<span class="label-text">Moduler</span>
						<input type="checkbox" class="toggle" on:change={() => {
							if (!isModulerSynced) isOpgaverSynced = false;
						}} bind:checked={isModulerSynced} />
					</label>
					<label class="label cursor-pointer">
						<span class="label-text">Opgaver <span class="btn btn-xs no-animation btn-info rounded-full font-bold mx-2">NY</span></span>
						<input type="checkbox" class="toggle" on:change={() => {
							if (!isOpgaverSynced) isModulerSynced = false;
						}} bind:checked={isOpgaverSynced} />
					</label>
				</div>
			</div>
			<p class="my-2 text-sm">
				på nuværende tidspunkt skal du vælge enten moduler eller opgaver, ikke begge to. det er en begrænsning i google api'et.
			</p>
			<div class="mt-2 flex justify-end">
				<button class="btn btn-sm btn-primary {isModulerSynced || isOpgaverSynced ? '' : 'btn-disabled'}" on:click={() => {
					turn = 3;
				}}>Næste</button>
			</div>
		</div>
	</div>
	<div class="collapse {turn === 3 ? 'collapse-open' : 'collapse-close'} join-item border border-base-300">
		<input type="radio" name="my-accordion-4" checked="checked" />
		<div class="collapse-title text-xl font-bold flex flex-row justify-between">
			<div>
				Vælg uge at synkronisere
			</div>
			{#if turn > 3}
				<div class="flex">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-check-circle-fill justify-center" viewBox="0 0 16 16">
						<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
					</svg>
				</div>
			{/if}
		</div>
		<div class="collapse-content">
			<div class="w-80">
				<div class="form-control">
					<label class="label">
						<span class="label-text">Ugenummer</span>
						{#if isOpgaverSynced}
							<input type="number" class="input input-bordered" min="1" max="52" bind:value={weeknr} disabled/>
						{:else}
							<input type="number" class="input input-bordered" min="1" max="52" bind:value={weeknr} />
						{/if}
					</label>
				</div>
				{#if isOpgaverSynced}
					<p class="text-sm">
						Ugenummer er kun gældende for moduler og ikke opgaver, det er kun de seneste 50 opgaver i Lectio, der bliver synkroniseret. (hvis du kun synkroniserer opgaver, er denne indstilling ligegyldig)
					</p>
				{/if}
			</div>
			<div class="mt-2 flex justify-end">
				<button class="btn btn-sm btn-primary" on:click={() => {
					turn = 4;
					sync();
				}}>Synkroniser</button>
			</div>
		</div>
	</div>
	<div class="collapse {turn === 4 ? 'collapse-open' : 'collapse-close'} join-item border border-base-300">
		<input type="radio" name="my-accordion-4" checked="checked" />
		<div class="collapse-title text-xl font-bold flex flex-row justify-between">
			<div>
				Synkroniser
			</div>
			{#if turn > 4}
				<div class="flex">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-check-circle-fill justify-center" viewBox="0 0 16 16">
						<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
					</svg>
				</div>
			{/if}
		</div>
		<div class="collapse-content">
			<div class="flex justify-between items-center mb-4 w-60">
				<p>henter skema</p>
				{#if isModulerSynced}
					{#if !skemaLoaded}
						<span class="loading loading-spinner loading-md"></span>
					{:else}
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-check-circle-fill justify-center" viewBox="0 0 16 16">
							<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
						</svg>
					{/if}
				{:else}
					<span class="btn btn-xs no-animation btn-warning font-bold mx-2">Ikke valgt</span>
				{/if}
			</div>
			<div class="flex justify-between items-center mb-4 w-60">
				<p>henter opgaver</p>
				{#if isOpgaverSynced}
					{#if !opgaverLoaded}
						<span class="loading loading-spinner loading-md"></span>
					{:else}
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-check-circle-fill justify-center" viewBox="0 0 16 16">
							<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
						</svg>
					{/if}
				{:else}
					<span class="btn btn-xs no-animation btn-warning font-bold mx-2">Ikke valgt</span>
				{/if}
			</div>
			<div class="flex justify-between items-center mb-4 w-60">
				<p>synkroniser</p>
				{#if !SyncLoaded}
					<span class="loading loading-spinner loading-md"></span>
				{:else}
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-check-circle-fill justify-center" viewBox="0 0 16 16">
						<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
					</svg>
				{/if}
			</div>
		</div>
	</div>
	<div class="collapse {turn === 5 ? 'collapse-open' : 'collapse-close'} join-item border border-base-300">
		<input type="radio" name="my-accordion-4" checked="checked" />
		<div class="collapse-title text-xl font-bold flex flex-row justify-between">
			<div>
				Synkronisering færdig
			</div>
			{#if turn > 5}
				<div class="flex">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-check-circle-fill justify-center" viewBox="0 0 16 16">
						<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
					</svg>
				</div>
			{/if}
		</div>
		<div class="collapse-content">
			<div id="message">
				Vær opmærksom på at det kan tage lidt tid før ændringerne er synlige i din kalender.
			</div>
			<div id="message">
				Vær også opmærksom på at de indsatte moduler og opgaver ikke bliver opdateret automatisk, så hvis der sker ændringer i dit skema, skal du synkronisere igen. for at få de nye ændringer reflekteret i din kalender.
			</div>
			<div class="divider"></div>
			<button class="btn btn-sm btn-primary"
				on:click={
					() => {
						window.location.href = 'https://calendar.google.com/calendar/u/0/r';
					}
				}
			>Gå til kalender</button>
			<button class="btn btn-sm btn-primary"
				on:click={
					() => {
						goto('/forside');
					}
				}
			>Gå tilbage</button>
		</div>
	</div>
</div>
