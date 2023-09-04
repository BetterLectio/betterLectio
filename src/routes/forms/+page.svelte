<script>
	import { get } from '$lib/js/http.js';
	import { spørgeskemaer } from '$lib/js/store.js';

	let ready = false;
	let åbneForBesvarelse = null;
	let åbenForRapportering = null;
	get('/spoergeskemaer').then(data => {
		$spørgeskemaer = data;
		åbneForBesvarelse = $spørgeskemaer.åbne_for_besvarelse;
		åbenForRapportering = $spørgeskemaer.åben_for_rapportering;

		ready = true;
	});
</script>

<div class="flex flex-row justify-between">
	<h1 class="heading">Spørgeskemaer</h1>
	<a href="/forms/lav" class="btn-success btn-sm btn"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg mr-2" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/></svg>Nyt</a>
</div>

{#if ready}
	{#if $spørgeskemaer.åbne_for_besvarelse.length > 0}
		<ul>
			{#each $spørgeskemaer.åbne_for_besvarelse as spørgeskema}
				<a href="/forms/besvar?id={spørgeskema.id}">
					<li class="element border-l-0 border-primary transition-all duration-100 hover:border-l-4 hover:rounded-l-none">
						<div>
							<div class="flex w-full flex-row justify-between">
								<p>
									<span class="font-bold">{spørgeskema.titel}</span>
								</p>
								<p class="font-light opacity-50">
									{`Svarfrist - ${ spørgeskema.svarfrist}`}
								</p>
							</div>
							<p>{spørgeskema.ejer}</p>
						</div>
					</li>
				</a>
			{/each}
		</ul>
	{/if}
{:else}
	<div class="loading btn-ghost btn">Indlæser</div>
{/if}
