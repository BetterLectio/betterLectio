<script>
	import { indstillinger, studieplan } from '$lib/js/store.js';
	import PageLoading from '$lib/components/PageLoading.svelte';
	import { get } from '$lib/js/http.js';
	import { holdOversætterNy } from '$lib/js/HoldOversætter.js';

	let ready = false;
	async function loaded() {
		// eslint-disable-next-line require-atomic-updates, no-await-in-loop
		for (let i = 0; i < $studieplan.length; i++) if ($indstillinger.brugHoldOversætter) $studieplan[i].fag = await holdOversætterNy($studieplan[i].fag_id, $studieplan[i].fag);
		ready = true;
	}

	get('/studieplan').then(data => {
		$studieplan = data;
		loaded();
	});

</script>

{#if ready}
	<div>
		<h1 class="heading">Studieplan</h1>
		<div class="join join-vertical w-full">
			{#each $studieplan as fag}
				<div class="collapse collapse-arrow join-item border border-base-300">
					<input type="radio" name="my-accordion-4" />
					<div class="collapse-title text-xl font-medium">
						<p>{fag.fag}</p>
					</div>
					<div class="collapse-content">
						{#each fag.kalender as forløb}
							<a href="/forloeb?id={forløb.id}">
								<div class="element hover:scale-[1.01]">
									<h2 class="text-xl font-bold">{forløb.titel}</h2>
									<p>Periode: {forløb.periode}</p>
									<p>Estimat: {forløb.estimat}</p>
									<br/>
									<p>{forløb.beskrivelse.length === 0 ? 'Dette forløb har ingen beskrivelse' : forløb.beskrivelse}</p>
								</div>
							</a>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
{:else}
	<PageLoading></PageLoading>
{/if}
