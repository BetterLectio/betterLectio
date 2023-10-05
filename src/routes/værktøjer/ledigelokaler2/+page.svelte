<script>
	import { get } from '$lib/js/http.js';
	import { lokaleDagsorden } from '$lib/js/store.js';
	import { standardizeTimeRange } from '$lib/js/LectioUtils.js';

	get('/lokale_dagsorden').then(data => {
		$lokaleDagsorden = data;
	});

	let ledigeLokaler = [];
	let optagedeLokaler = [];

	function sortLokaler(_time) {
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
	}

	const now = new Date(Date.now());
	let time = `${now.getHours() }:${ now.getMinutes()}`;
	// eslint-disable-next-line no-unused-expressions
	$: time, sortLokaler(time);
</script>

{#if $lokaleDagsorden}
	<input type="time" bind:value={time} class="input input-bordered w-full max-w-xs" />

	<ul class="list mb-4">
		<h1 class="heading">Ledige lokaler</h1>
		{#each ledigeLokaler as lokale}
			<li>
				<a class="btn-success btn mb-2 flex h-fit scale-99 hover:scale-100 md:justify-between text-lg font-bold" href="/skema?id={lokale.id}">{lokale.navn}</a>
			</li>
		{/each}
		{#if ledigeLokaler.length === 0}
			<p class="mb-2">Der er ingen optagede lokaler!</p>
		{/if}
	</ul>

	<ul class="list mb-4">
		<h1 class="pb-2 text-2xl font-bold">Optagede lokaler</h1>
		{#each optagedeLokaler as lokale}
			<li>
				<a class="btn-error btn mb-2 flex h-fit scale-99 justify-between hover:scale-100 text-lg font-bold" href="/skema?id={lokale.id}">{lokale.navn}</a>
			</li>
		{/each}
		{#if optagedeLokaler.length === 0}
			<p class="mb-2">Der er ingen optagede lokaler!</p>
		{/if}
	</ul>
{/if}
