<script>
	import BrugerPopup from '$lib/components/BrugerPopup.svelte';
	import { blur } from 'svelte/transition';
	import { cookieInfo } from '$lib/js/LectioCookieHandler.js';
	import { get } from '$lib/js/http.js';

	let cookie = null;
	cookieInfo().then(data => {
		cookie = data;
	});

	let searchString = '';
	let searchResults = {
		opgaver: [],
		lektier: [],
		forside: [],
		skema: [],
		beskeder: [],
		fravaer: [],
		dokumenter: [],
		elever: []
	};

	let nyheder = null,
		fravaer = null,

		// dokumenter = null,
		forside = null,
		lektier = null,
		opgaver = null,
		skema = null,
		alleElever = null,
		beskeder = null;

	$: dataLoaded = [opgaver, nyheder, lektier, forside, skema, fravaer, alleElever, beskeder].every(item => item !== null);
	$: anyResults = Object.values(searchResults).some(result => result.length);

	let animationDelay = 0;

	function convertDate(dateString) {
		// Split the date string into parts
		const allParts = dateString.split(' ');
		const parts = allParts[0].split('-');
		const year = parseInt(parts[1], 10);
		const dateParts = parts[0].split('/');

		const timePart = allParts[1].split(':');
		const hour = parseInt(timePart[0], 10);
		const minute = parseInt(timePart[1], 10);

		// Extract the day, month, and year from the parts array
		const day = parseInt(dateParts[0], 10);
		const month = parseInt(dateParts[1], 10);

		// Create a new Date object
		const date = new Date();

		// Set the day, month, and year of the Date object
		date.setFullYear(year, month - 1, day);
		date.setHours(hour, minute, 0, 0);

		// Return the Date object
		return date;
	}

	async function loadData() {
		const promises = [
			get('/opgaver'),
			fetch('https://raw.githubusercontent.com/BetterLectio/news/main/news.json').then(response => response.json()),
			get('/lektier'),
			get('/forside'),
			get(`/skema?id=${`S${ cookie.userId}`}`),
			get('/fravaer').then(data => ({ sort: { col: 'procent', ascending: true }, data })),
			get('/informationer').then($informationer => Object.entries($informationer.elever).map(([navn, id]) => ({ navn, id }))),
			get(`/beskeder2`).then(data => data.map(besked => {
				besked.datoObject = convertDate(besked.dato);
				return besked;
			}))
		];
		[opgaver, nyheder, lektier, forside, skema, fravaer, alleElever, beskeder] = await Promise.all(promises);
		return true;
	}

	function deleteSearchResults() {
		animationDelay = 0;
		searchResults = {
			opgaver: [],
			forside: [],
			skema: [],
			beskeder: [],
			elever: [],

			// not working currently
			fravaer: [],
			dokumenter: [],
			lektier: []
		};
	}

	function search() {
		if (searchString === '') return;

		deleteSearchResults();

		opgaver.forEach(opgave => {
			if (opgave.opgavetitel.toLowerCase().includes(searchString.toLowerCase())) searchResults.opgaver.push(opgave);
		});

		// lektier.forEach(lektie => {
		// 	if (lektie.aktivitet.navn && lektie.aktivitet.navn.toLowerCase().includes(searchString.toLowerCase())) searchResults.lektier.push(lektie);
		// 	else if (lektie.aktivitet.andet.toLowerCase().includes(searchString.toLowerCase())) searchResults.lektier.push(lektie);
		// });

		forside.aktuelt.forEach(iterableForside => {
			if (iterableForside.text.toLowerCase().includes(searchString.toLowerCase())) searchResults.forside.push(iterableForside);
		});

		skema.moduler.forEach(modul => {
			if (modul.navn) if (modul.navn.toLowerCase().includes(searchString.toLowerCase())) searchResults.skema.push(modul);

			if (modul.hold) if (modul.hold.toLowerCase().includes(searchString.toLowerCase())) searchResults.skema.push(modul);

			if (modul.andet) if (modul.andet.toLowerCase().includes(searchString.toLowerCase())) searchResults.skema.push(modul);

			if (modul.tidspunkt.toLowerCase().includes(searchString.toLowerCase())) searchResults.skema.push(modul);
		});

		beskeder.forEach(besked => {
			if (besked.emne.toLowerCase().includes(searchString.toLowerCase())) searchResults.beskeder.push(besked);

			if (besked.førsteBesked.toLowerCase().includes(searchString.toLowerCase())) searchResults.beskeder.push(besked);
		});

		alleElever.forEach(elev => {
			if (elev.navn.toLowerCase().includes(searchString.toLowerCase())) searchResults.elever.push(elev);
		});
	}
</script>

<input type="checkbox" id="søg-popup" class="modal-toggle" on:click={() => loadData()} />
{#if localStorage.getItem('lectio-cookie')}
	<label for="søg-popup" class="modal cursor-pointer">
		<span class="modal-box relative">
			<h3 class="mb-1 text-xl font-bold">Søg Lectio</h3>
			<p class="mb-4">Søg efter opgaver, elever og meget mere i Lectio.</p>

			<!-- Search input -->
			<div class="flex w-full flex-row">
				<input
					type="text"
					placeholder={dataLoaded ? 'Søg' : `Indlæser...`}
					disabled={!dataLoaded}
					id="input"
					class="input-bordered input-primary input w-full bg-base-300"
					bind:value={searchString}
					on:change={search}
				/>
			</div>

			{#if anyResults}
				<div class="divider"></div>

				<!--Search query results-->
				<div class="flex w-full flex-col rounded-lg bg-base-200 p-2">
					<ul class="menu w-full flex-col rounded-box mt-2 p-1">
						{#if searchResults.opgaver.length > 0}
							<p class="hidden">{animationDelay++}</p>
							<li class="menu-title" in:blur={{ duration: 300, delay: animationDelay * 100 }} out:blur>
								<span>Opgaver</span>
							</li>
							{#each searchResults.opgaver as opgave, i}
								<p class="hidden">{(animationDelay += i)}</p>
								<li class="w-full" in:blur={{ duration: 300, delay: animationDelay * 100 }} out:blur>
									<a href="/opgave?exerciseid={opgave.exerciseid}" rel="external">{opgave.opgavetitel}</a>
								</li>
							{/each}
						{/if}

						{#if searchResults.lektier.length > 0}
							<p class="hidden">{animationDelay++}</p>
							<li class="menu-title" in:blur={{ duration: 300, delay: animationDelay * 100 }} out:blur>
								<span>Lektier</span>
							</li>
							{#each searchResults.lektier as lektie, i}
								<p class="hidden">{(animationDelay += i)}</p>
								<li class="w-full" in:blur={{ duration: 300, delay: animationDelay * 100 }} out:blur>
									<a href="/modul?absid={lektie.aktivitet.absid}" rel="external">{lektie.aktivitet.navn || lektie.aktivitet.hold}</a>
								</li>
							{/each}
						{/if}

						{#if searchResults.forside.length > 0}
							<p class="hidden">{animationDelay++}</p>
							<li class="menu-title w-full" in:blur={{ duration: 300, delay: animationDelay * 100 }} out:blur>
								<span>Forside</span>
							</li>
							{#each searchResults.forside as iterableForside, i}
								<p class="hidden">{(animationDelay += i)}</p>
								<li class="w-full" in:blur={{ duration: 300, delay: animationDelay * 100 }} out:blur>
									<a href="/forside" class="w-full overflow-x-scroll" rel="external">{iterableForside.text}</a>
								</li>
							{/each}
						{/if}

						{#if searchResults.skema.length > 0}
							<p class="hidden">{animationDelay++}</p>
							<li class="menu-title w-full" in:blur={{ duration: 300, delay: animationDelay * 100 }} out:blur>
								<span>Skema</span>
							</li>
							{#each searchResults.skema as modul, i}
								<p class="hidden">{(animationDelay += i)}</p>
								<li class="w-full" in:blur={{ duration: 300, delay: animationDelay * 100 }} out:blur>
									<a href="/modul?absid={modul.absid}" rel="external">
										{#if modul.navn}
											{modul.navn}
										{:else if modul.hold}
											{modul.hold}
										{:else if modul.andet}
											{modul.andet}
										{/if}
									</a>
								</li>
							{/each}
						{/if}

						{#if searchResults.beskeder.length > 0}
							<p class="hidden">{animationDelay++}</p>
							<li class="menu-title w-full" in:blur={{ duration: 300, delay: animationDelay * 100 }} out:blur>
								<span>Beskeder</span>
							</li>
							{#each searchResults.beskeder as besked, i}
								<p class="hidden">{(animationDelay += i)}</p>
								<li class="w-full" in:blur={{ duration: 300, delay: animationDelay * 100 }} out:blur>
									<a href="/besked?id={besked.message_id}" rel="external">{besked.emne}</a>
								</li>
							{/each}
						{/if}
						{#if searchResults.elever.length > 0}
							<p class="hidden">{animationDelay++}</p>
							<li class="menu-title w-full" in:blur={{ duration: 300, delay: animationDelay * 100 }} out:blur>
								<span>Elever</span>
							</li>
							{#each searchResults.elever as elev, i}
								<p class="hidden">{(animationDelay += i)}</p>
								<li class="w-full" in:blur={{ duration: 300, delay: animationDelay * 100 }} out:blur>
									<p><BrugerPopup navn={elev.navn} id={elev.id}>{elev.navn}</BrugerPopup></p>
								</li>
							{/each}
						{/if}

						<!-- add missing things here-->
					</ul>
				</div>
			{/if}
		</span>
	</label>
{/if}
