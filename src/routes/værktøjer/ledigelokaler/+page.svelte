<script>
	import PageLoading from '$lib/components/PageLoading.svelte';
	import { get } from '$lib/js/http.js';
	import { lokaleDagsorden } from '$lib/js/store.js';
	import { standardizeTimeRange } from '$lib/js/LectioUtils.js';


	let ledigeLokaler = [];
	let _ledigeLokaler = [];
	let optagedeLokaler = [];
	let _optagedeLokaler = [];
	let searchString = '';
	let ready = false;

	const now = new Date(Date.now());
	let time = `${(`0${ now.getHours()}`).slice(-2)}:${(`0${ now.getMinutes()}`).slice(-2)}`;
	get('/lokale_dagsorden').then(data => {
		console.log(time);
		$lokaleDagsorden = data;
		ready = true;
		// eslint-disable-next-line no-use-before-define
		sortLokaler(time);
	});

	// eslint-disable-next-line no-use-before-define
	$: sortLokaler(time);


	function sortLokaler(_time) {
		if (!ready) return;
		ledigeLokaler = [];
		optagedeLokaler = [];
		const time = new Date(Date.now());
		time.setHours(_time.split(':')[0], _time.split(':')[1]);
		$lokaleDagsorden.forEach(lokale => {
			ledigeLokaler.push(lokale);
			console.log(lokale);
			lokale.moduler.forEach(modul => {
				const [modulStart, modulEnd] = standardizeTimeRange(modul);
				if (time >= modulStart && time <= modulEnd) {
					console.log('i gang: ', lokale);
					optagedeLokaler = [...optagedeLokaler, lokale];
					ledigeLokaler = ledigeLokaler.filter(_lokale => _lokale.id !== lokale.id);
				}
			});
		});
		_ledigeLokaler = ledigeLokaler;
		_optagedeLokaler = optagedeLokaler;

		if (searchString.length > 0) {
			search();
		}
	}

	function search() {
		const __ledigeLokaler = [];
		ledigeLokaler.forEach(lokale => {
			if (lokale.navn.toLowerCase().includes(searchString.toLowerCase())) __ledigeLokaler.push(lokale);
		});
		_ledigeLokaler = __ledigeLokaler;

		const __optagedeLokaler = [];
		optagedeLokaler.forEach(lokale => {
			if (lokale.navn.toLowerCase().includes(searchString.toLowerCase())) __optagedeLokaler.push(lokale);
		});
		_optagedeLokaler = __optagedeLokaler;
	}
// eslint-disable-next-line no-unused-expressions
</script>

{#if $lokaleDagsorden && ready}
	<h1 class="heading">Ledige lokaler</h1>

	<div class="flex sm:flex-row flex-col mb-2">
		<div class="form-control">
			<label class="input-group">
				<span class="sm:h-10 mt-2 sm:mt-0">Klokken</span>
				<input type="time" bind:value={time} class="input sm:h-10 bg-base-200 mt-2 sm:mt-0 w-full" />
			</label>
		</div>
		<div class="form-control sm:ml-2">
			<label class="input-group">
				<span class="sm:h-10 mt-2 sm:mt-0">Søg</span>
				<input
					type="text"
					placeholder=""
					class="input sm:h-10 bg-base-200 mt-2 sm:mt-0 w-full"
					bind:value={searchString}
					on:input={search}
				/>
			</label>
		</div>
	</div>

	<ul class="list mb-4">
		{#each _ledigeLokaler as lokale}
			<li>
				<a class="btn-success btn mb-2 flex h-fit scale-99 hover:scale-100 md:justify-between text-lg font-bold" href="/skema?id={lokale.id}">{lokale.navn}</a>
			</li>
		{/each}
		{#if _ledigeLokaler.length === 0}
			<p class="mb-2">Der er ingen ledige lokaler!</p>
		{/if}
	</ul>

	<ul class="list mb-4">
		<h1 class="pb-2 text-2xl font-bold">Optagede lokaler</h1>
		{#each _optagedeLokaler as lokale}
			<li>
				<a class="btn-error btn mb-2 flex h-fit scale-99 justify-between hover:scale-100 text-lg font-bold" href="/skema?id={lokale.id}">{lokale.navn}</a>
			</li>
		{/each}
		{#if _optagedeLokaler.length === 0}
			<p class="mb-2">Der er ingen optagede lokaler!</p>
		{/if}
	</ul>
{:else}
	<PageLoading></PageLoading>
{/if}
