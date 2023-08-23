<script>
	import { beskeder, brugeren, informationer } from '$lib/js/store.js';
	import Avatar from '$lib/components/Avatar.svelte';
	import { cookieInfo } from '$lib/js/LectioCookieHandler';
	import { fade } from 'svelte/transition';
	import { get } from '$lib/js/http.js';

	let cookie = null;
	cookieInfo().then(data => {
		cookie = data;
	});
	get('/mig').then(data => {
		$brugeren = data;
	});

	/**
	 * TODO:
	 *    - Gør så man kan downloade filer uden at blive redirectet til modul siden
	 *    - Måske gør så man får al teksten og derfor ikke behøver at klikke på lektien
	 */

	get('/informationer').then(data => {
		$informationer = data;
		const _elever = {};
		for (const [key, value] of Object.entries($informationer.elever)) {
			let navn = key.split('(').at(-1)
				.split(' ');
			navn.pop();
			navn = navn.join(' ');
			navn = `${key.split(navn)[0].slice(0, -1)}(${navn})`;
			_elever[navn] = value;
		}
		$informationer.lærereOgElever = { ...$informationer.lærere, ..._elever };
	});

	let ready = false;
	let _beskeder = [];
	let nrOfShownMessages = 50;

	function convertDate(dateString) {
		// Split the date string into parts
		const allparts = dateString.split(' ');
		const parts = allparts[0].split('-');
		const year = parseInt(parts[1], 10);
		const dateparts = parts[0].split('/');
		const timepart = allparts[1].split(':');
		const hour = parseInt(timepart[0], 10);
		const minute = parseInt(timepart[1], 10);

		// Extract the day, month, and year from the parts array
		const day = parseInt(dateparts[0], 10);
		const month = parseInt(dateparts[1], 10);

		// Create a new Date object
		const date = new Date();

		// Set the day, month, and year of the Date object
		date.setFullYear(year, month - 1, day);
		date.setHours(hour, minute, 0, 0);

		// Return the Date object
		return date;
	}

	get(`/beskeder2`).then(data => {
		_beskeder = data.map(besked => {
			besked.datoObject = convertDate(besked.dato);
			return besked;
		});
		$beskeder = [..._beskeder];

		// only include the first 10 messages
		$beskeder = $beskeder.slice(0, 50);
		ready = true;
	});

	function showMore() {
		nrOfShownMessages += 50;
		$beskeder = [..._beskeder.slice(0, nrOfShownMessages)];
	}

	let selected = 'Alle';
	let searchString = '';

	function isAuthor(messageAuthor) {
		return messageAuthor.replace('(', '').replace(')', '') === $brugeren.navn.replace(',', '');
	}

	function getValidModtagere(modtagere) {
		const validModtagere = [];
		for (const modtager of modtagere) if ($informationer?.lærereOgElever[modtager]) validModtagere.push(modtager);

		return validModtagere;
	}
</script>

<span class="my-2 flex justify-between">
	<h1 class="heading">Beskeder</h1>
</span>
<div class="flex flex-wrap justify-between">
	<span class="mb-2 flex flex-col sm:flex-row">
		<div class="tabs tabs-boxed flex w-full justify-between">
			<button
				class={selected === 'Alle' ? 'tab tab-active tab-sm sm:tab-md' : 'tab tab-sm sm:tab-md'}
				on:click={() => {
					selected = 'Alle';
				}}>Alle</button
			>
			<button
				class={selected === 'Modtaget' ? 'tab tab-active tab-sm sm:tab-md' : 'tab tab-sm sm:tab-md'}
				on:click={() => {
					selected = 'Modtaget';
				}}>Modtaget</button
			>
			<button
				class={selected === 'Sendte' ? 'tab tab-active tab-sm sm:tab-md' : 'tab tab-sm sm:tab-md'}
				on:click={() => {
					selected = 'Sendte';
				}}>Sendte</button
			>
		</div>
		<input type="text" placeholder="Søg" class="input m-0 mt-4 h-10 w-fit bg-base-200 sm:mt-0 sm:ml-4 sm:w-fit" bind:value={searchString} />
	</span>
	{#if cookie?.userid}
		<div class="right-1 mb-2 flex items-center rounded-md bg-base-200 p-1">
			<a
				href={`https://www.lectio.dk/lectio/${cookie.school}/beskeder2.aspx?type=nybesked&elevid=${cookie.userid}`}
				target="_blank"
				class="btn-primary btn-sm btn border-base-200 bg-base-200 font-normal normal-case text-gray-500 hover:text-gray-100">Skriv besked</a
			>
		</div>
	{/if}
</div>

<!-- main content -->
<ul class="list h-[calc(100vh_-_16.5rem)] w-full overflow-clip">
	{#if ready && $informationer && $beskeder}
		{#each Array.from($beskeder) as besked}
			{#if selected === 'Alle' || (selected === 'Sendte' && isAuthor(besked.førsteBesked)) || (selected === 'Modtaget' && !isAuthor(besked.førsteBesked))}
				{#if !searchString || besked.emne.toLowerCase().includes(searchString.toLowerCase())}
					<a class="block" href="/besked?id={besked.message_id}">
						<li in:fade class="rounded-md p-2 hover:bg-base-100">
							<div class="flex justify-between">
								<div class="ml-1 flex items-center">
									<Avatar id={$informationer.lærereOgElever[besked.førsteBesked]} navn={besked.førsteBesked} size="h-12 w-12" />
									<div class="ml-5">
										<p part="emne" class="text-lg font-bold">
											{besked.emne}
										</p>
										<p part="afsender">
											{besked.førsteBesked} · {besked.ændret}
										</p>
									</div>
								</div>
								<div class="right-1 flex items-center">
									<div class="mr-1 flex -space-x-4">
										{#if window.innerWidth > 640}
											{#each getValidModtagere(besked.modtagere).slice(0, 3) as modtager}
												{#if $informationer?.lærereOgElever[modtager]}
													<div class="z-0">
														<Avatar id={$informationer.lærereOgElever[modtager]} navn={modtager} size="h-10 w-10" />
													</div>
												{/if}
											{/each}
											{#if getValidModtagere(besked.modtagere).length > 3}
												<div class="z-10 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-xs font-medium text-white">
													+{besked.modtagere.length - 3}
												</div>
											{/if}
										{/if}
									</div>
								</div>
							</div>
						</li>
					</a>
				{/if}
			{/if}
		{/each}
		<div class="flex justify-center">
			{#if $beskeder.length !== _beskeder.length}
				<button class="btn-info btn-sm btn my-4" on:click={showMore}>Indlæs flere beskeder</button>
			{:else}
				<button class="btn-warning btn-sm btn my-4" on:click={showMore}>Ikke flere beskeder</button>
			{/if}
		</div>
	{:else}
		<!-- skeleton loader start-->
		<!-- eslint-disable-next-line no-unused-vars -->
		{#each { length: 20 } as _}
			<div class="w-full p-2">
				<div class="flex rounded-md h-14 justify-between animate-pulse">
					<div class="flex items-center">
						<div class="rounded-full ml-2 h-12 w-12 bg-base-300" />
						<div class="ml-5">
							<div class="h-4 bg-base-300 rounded w-48" />
							<div class="h-4 bg-base-300 rounded w-1/4 mt-1" />
						</div>
					</div>
					<div class="flex items-center">
						<div class="flex -space-x-4">
							<div class="rounded-full h-10 w-10 bg-base-300" />
							<div class="rounded-full h-10 w-10 bg-base-300" />
							<div class="rounded-full h-10 w-10 bg-base-300" />
						</div>
					</div>
				</div>
			</div>
		{/each}
		<!-- skeleton loader end-->
	{/if}
</ul>
