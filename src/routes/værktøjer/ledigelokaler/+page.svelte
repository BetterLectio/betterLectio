<script>
	import { informationer, lokaler } from '$lib/js/store.js';
	import { get } from '$lib/js/http.js';
	import { goto } from '$app/navigation';

	get('/ledige_lokaler').then(data => {
		const _lokaler = { ledige: [], optagede: [] };
		data.forEach(lokale => {
			if (lokale.status === 'ledigt') _lokaler.ledige.push(lokale);
			else if (lokale.status === 'optaget') _lokaler.optagede.push(lokale);
		});
		$lokaler = _lokaler;
	});

	let lokalerAndRoomId = {};

	get('/informationer').then(data => {
		$informationer = data;
		lokalerAndRoomId = data.lokaler;
	});

	function findRoomIdAndRedirect(roomName) {
		// the lokalerAndRoomId is an object with the room name as key and the room id as value
		// so we can just get the value by using the room name as key and search for it in the object

		// filter the value to not have "O" in the second index of the string then redirect to the skema page
		for (const [key, value] of Object.entries(lokalerAndRoomId)) if (`Lokale ${ key}` === roomName) goto(`/skema?id=${value.slice(0, 1) + value.slice(2)}`);
	}
</script>

{#if $lokaler}
	<ul class="list mb-4">
		<h1 class="heading">Ledige lokaler</h1>
		{#each $lokaler.ledige as lokale}
			<li
				class="btn-success btn mb-2 flex h-fit scale-99 hover:scale-100 md:justify-between"
				on:click={findRoomIdAndRedirect(lokale.lokale)}
			>
				<p class="text-lg font-bold">{lokale.lokale}</p>
			</li>
		{/each}
		{#if $lokaler.ledige.length === 0}
			<p class="mb-2">Der er ingen optagede lokaler!</p>
		{/if}
	</ul>

	<ul class="list mb-4">
		<h1 class="pb-2 text-2xl font-bold">Optagede lokaler</h1>
		{#each $lokaler.optagede as lokale}
			<li class="btn-error btn mb-2 flex h-fit scale-99 justify-between hover:scale-100" on:click={findRoomIdAndRedirect(lokale.lokale)}>
				<p class="text-lg font-bold">{lokale.lokale}</p>
			</li>
		{/each}
		{#if $lokaler.optagede.length === 0}
			<p class="mb-2">Der er ingen optagede lokaler!</p>
		{/if}
	</ul>
{/if}
