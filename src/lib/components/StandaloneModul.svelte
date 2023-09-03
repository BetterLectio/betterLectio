<script>
	import { getModulColor } from '$lib/js/LectioUtils.js';

	export let modul = {};
	export let renderWithColor = true;
</script>

<a class="btn mb-4 block h-fit p-2 normal-case hover:scale-105" href="/modul/?absid={modul.absid}" style={`background-color:${getModulColor(modul, renderWithColor)}`}>
	{#if modul.navn}
		{#if modul.andet}
			<div class="tooltip flex justify-center" data-tip="Har indhold">
				<h1 class="text-xl font-bold">{modul.navn} {modul.hold}</h1>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					fill="currentColor"
					class="bi bi-bookmark-fill ml-4 mt-1"
					viewBox="0 0 16 16"
				>
					<path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
				</svg>
			</div>
		{:else}
			<h1 class="text-xl font-bold">{modul.navn} {modul.hold}</h1>
		{/if}
	{:else}
		<h1 class="text-xl font-bold">{modul.hold}</h1>
	{/if}
	<h1 class="text-sm font-bold">{modul.tidspunkt}</h1>
	{#if modul.lokale}
		<h1 class="text-sm font-bold">{modul.lokale}</h1>
	{/if}
</a>
