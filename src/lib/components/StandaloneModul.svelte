<script>
	import { getModulColor, standardizeTimeRange } from '$lib/js/LectioUtils.js';
	import { holdOversætterNy } from '$lib/js/HoldOversætter.js';
	import { indstillinger } from '$lib/js/store.js';

	export let modul = {};
	export let renderWithColor = true;
	const timeOptions = ['en-GB', {
		hour: '2-digit',
		minute: '2-digit'
	} ];
	let oversatHold = modul.hold;
	let startTime = null;
	let endTime = null;

	async function fetchModulHold() {
		if (modul.hold_id !== null && $indstillinger.brugHoldOversætter) oversatHold = await holdOversætterNy(modul.hold_id, modul.hold);
		return oversatHold;
	}

	function getModulTime() {
		[startTime, endTime] = standardizeTimeRange(modul.tidspunkt);
	}

	// if the modul has changed, run the function
	$: if (modul) {
		fetchModulHold();
		getModulTime();
	}
</script>

{#if !modul.absid.includes('privat')}
	<a class="btn mb-4 last:mb-0 block h-fit p-2 normal-case hover:scale-105 border-0" href="/modul/?absid={modul.absid}" style={`background-color:${getModulColor(modul, renderWithColor)}`}>
		{#if modul.navn}
			{#if modul.andet}
				<div class="tooltip flex justify-center" data-tip="Har indhold">
					<h1 class="text-xl font-bold">{modul.navn}</h1>
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
				{#if modul.hold}
					<div><h1 class="text-lg font-bold truncate">{oversatHold}</h1></div>
				{/if}
			{:else if modul.hold}
				<h1 class="text-xl font-bold">{modul.navn}</h1>
				<div><h1 class="text-lg font-bold truncate">{oversatHold}</h1></div>
			{/if}
		{:else}
			<h1 class="text-xl font-bold">{oversatHold}</h1>
		{/if}
		<h1 class="text-sm font-bold">
			{startTime.toLocaleTimeString(...timeOptions)} - {endTime.toLocaleTimeString(...timeOptions)}
			<p class="border-2 inline">{modul.lokale ? ` · ${modul.lokale}` : ''}</p>
		</h1>
	</a>
{:else}
	<div class="btn mb-4 block h-fit p-2 normal-case border-0 no-animation last:mb-0" style={`background-color:${getModulColor(modul, renderWithColor)}`}>
		<div class="flex justify-center items-center">
			{#if modul.navn}
				{#if modul.hold}
					<h1 class="text-xl font-bold">{modul.navn}</h1>
					<div><h1 class="text-lg font-bold truncate">{oversatHold}</h1></div>
				{/if}
			{:else}
				<h1 class="text-xl font-bold">{oversatHold}</h1>
			{/if}
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-person-fill-lock ml-2" viewBox="0 0 16 16">
				<path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm-9 8c0 1 1 1 1 1h5v-1a1.9 1.9 0 0 1 .01-.2 4.49 4.49 0 0 1 1.534-3.693C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4Zm7 0a1 1 0 0 1 1-1v-1a2 2 0 1 1 4 0v1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-2Zm3-3a1 1 0 0 0-1 1v1h2v-1a1 1 0 0 0-1-1Z"/>
			</svg>
		</div>
		<h1 class="text-sm font-bold">
			{startTime.toLocaleTimeString(...timeOptions)} - {endTime.toLocaleTimeString(...timeOptions)}
		</h1>
	</div>
{/if}
