<script>
	import CryptoJS from 'crypto-es';
	import { cookieInfo } from '$lib/js/LectioCookieHandler';
	import { get } from '$lib/js/http.js';

	let cookie = null;
	cookieInfo().then(cookieData => {
		cookie = cookieData;
	});

	let tokenClient = null;
	let gApiInitialized = false;
	let gIsInitialized = false;

	let loggedin = false;
	let responseObj = {};

	// weeknr = url param "week"
	let weeknr = new URLSearchParams(window.location.search).get('week');

	$: if (weeknr) console.log(weeknr);

	// TODO: flyt til .env eller pin kode indtastning eller noget ¯\_(ツ)_/¯
	const secretKey = 'meget hemmelig nøgle';

	function handleAutoAuth() {
		const ciphertext = localStorage.getItem('G-apitoken');
		if (ciphertext === null) return;

		const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
		const token = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

		// se if token is expired
		if (token !== null && token.expires_at < Date.now()) {
			loggedin = false;
			localStorage.removeItem('G-apitoken');
			return;
		}
		if (token !== null) {
			document.getElementById('signout_button').style.visibility = 'visible';
			document.getElementById('authorize_button').innerText = 'genopfrisk adgang';
			gapi.client.setToken(token);
			loggedin = true;
		}
	}

	const start = async() => {
		const CLIENT_ID = '24684948206-14gdudquegcmmekdkfk2ud0isq4i2bnj.apps.googleusercontent.com';
		const API_KEY = 'AIzaSyA8zKy_id5K_c7_HvmueBjRf_EB-8n0-z4';
		const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
		const SCOPES = 'https://www.googleapis.com/auth/calendar';

		document.getElementById('authorize_button').style.visibility = 'hidden';
		document.getElementById('signout_button').style.visibility = 'hidden';

		await gapi.client.init({
			apiKey: API_KEY,
			discoveryDocs: DISCOVERY_DOCS
		});
		gApiInitialized = true;
		tokenClient = google.accounts.oauth2.initTokenClient({
			client_id: CLIENT_ID,
			scope: SCOPES,

			// defined later
			callback: ''
		});
		gIsInitialized = true;
		if (gApiInitialized && gIsInitialized) document.getElementById('authorize_button').style.visibility = 'visible';

		handleAutoAuth();
	};

	const initializeGapi = () => {
		gapi.load('client', start);
	};

	function handleAuthClick() {
		tokenClient.callback = response => {
			if (response.error !== undefined) throw response;

			document.getElementById('signout_button').style.visibility = 'visible';
			document.getElementById('authorize_button').innerText = 'genopfrisk adgang';
			loggedin = true;

			// save token to localstorage
			const ciphertext = CryptoJS.AES.encrypt(JSON.stringify({ ...gapi.client.getToken(), expires_at: Date.now() + 3600000 }),
				secretKey).toString();
			localStorage.setItem('G-apitoken', ciphertext);
		};

		if (gapi.client.getToken() === null) {
			// Prompt the user to select a Google Account and ask for consent to share their data
			// when establishing a new session.
			tokenClient.requestAccessToken({ prompt: 'consent' });
		} else {
			// Skip display of account chooser and consent dialog for an existing session.
			tokenClient.requestAccessToken({ prompt: '' });
		}
	}

	function handleSignoutClick() {
		// remove token from localstorage
		localStorage.removeItem('G-apitoken');

		const token = gapi.client.getToken();
		if (token !== null) {
			google.accounts.oauth2.revoke(token.access_token);
			gapi.client.setToken('');
			document.getElementById('authorize_button').innerText = 'Log ind';
			document.getElementById('signout_button').style.visibility = 'hidden';
			loggedin = false;
		}
	}

	function createEvent(modul) {
		const event = {
			summary: modul.hold,
			id: `${modul.absid }betlec2`,
			description: modul.linkToLectio,
			start: {
				dateTime: modul.googleStart,
				timeZone: 'Europe/Copenhagen'
			},
			end: {
				dateTime: modul.googleEnd,
				timeZone: 'Europe/Copenhagen'
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

	let processedBatch = [];

	async function sync() {
		processedBatch = [];

		// fetch data from Lectio
		const year = new Date().getFullYear();
		const skema = await get(`/skema?id=${`S${ cookie.userid}`}&uge=${weeknr}&år=${year}`);
		const { moduler } = skema;

		// make a forEach loop that creates an event for each module
		moduler.forEach(modul => {
			const [startDate, endDate] = convertLectioTime(modul.tidspunkt);

			// create event does additonal processing of the event
			processedBatch.push(createEvent({
				...modul,
				googleStart: startDate,
				googleEnd: endDate,
				linkToLectio: `https://app.betterlectio.dk/modul?absid=${ modul.absid}`
			}));
		});
		console.log(processedBatch);

		// batch insert events
		const batch = gapi.client.newBatch();
		processedBatch.forEach(event => {
			batch.add(gapi.client.calendar.events.insert({ calendarId: 'primary', resource: event }));
		});
		batch.then(response => {
			console.log(response.result);
			responseObj = response.result;
		}).catch(err => {
			console.error(err);
		});
	}
</script>

<svelte:head>
	<script src="https://accounts.google.com/gsi/client"></script>
	<script src="https://apis.google.com/js/api.js" on:load={initializeGapi}></script>
</svelte:head>

<h1 class="heading">Google Kalender-synkronisering</h1>

{#if !loggedin}
	<div class="alert alert-info mb-4">
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"
		><path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
		/></svg
		>
		<span>Vi arbejder på at blive godkendt af Google. Indtil da vil der være en advarsel om, at siden ikke er verificeret.</span>
	</div>
{:else}
	<p class="text-sm md:w-96 italic my-4 border-l-2 pl-2 border-warning">
		Google Kalender-synkronisering er en funktion, der gør det muligt at synkronisere dine moduler fra BetterLectio til din Google Kalender.
		Hvis du synkroniserer en uge, du tidligere har synkroniseret, vil de gamle events ikke altid blive slettet. Hvis du har problemer med
		funktionen, så kontakt os på Discord.
	</p>
{/if}

<button class="btn btn-sm" id="authorize_button" on:click={handleAuthClick}>Log ind</button>
{#if !loggedin}
	<button class="btn btn-sm" id="signout_button" on:click={handleSignoutClick}>Log ud</button>
{/if}

<div class="divider" />

{#if loggedin}
	<div class="join">
		<input class="input input-bordered join-item" bind:value={weeknr} placeholder="Uge Nr." />
		<button class="btn btn-primary join-item" on:click={() => sync()}>synkroniser</button>
	</div>

	{#if responseObj}
		<h2 class="text-xl font-bold mt-4">Resultat</h2>
		<div class="overflow-x-auto w-fit">
			<table class="table table-xs">
				<!-- head -->
				<thead>
					<tr>
						<th>status</th>
						<th>besked</th>
						<th>hold</th>
						{#if Object.values(responseObj)[0].status !== '200'}
							<th>forklaring</th>
						{/if}
					</tr>
				</thead>
				<tbody>
					{#each processedBatch as event, i}
						<tr>
							<!-- FIXME: investigate if response.status is string or number type -->
							<th
							><p class="btn btn-xs {Object.values(responseObj)[i].status === 200 ? 'btn-success' : 'btn-error'}">
								{Object.values(responseObj)[0].status}
							</p></th
							>
							<td>{Object.values(responseObj)[i].statusText}</td>
							<td>{event.summary}</td>
							{#if Object.values(responseObj)[i].status !== 200}
								<td>{Object.values(responseObj)[i].result.error.message}</td>
							{/if}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
{/if}
