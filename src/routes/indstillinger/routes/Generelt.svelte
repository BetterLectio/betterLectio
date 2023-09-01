<script>
	import { get, reloadData } from '$lib/js/http.js';
	import { addNotification } from '$lib/js/notifyStore.js';
	import { indstillinger } from '$lib/js/store.js';

	let windowWidth = window.innerWidth;

	function handleResize() {
		windowWidth = window.innerWidth;
	}

	window.addEventListener('resize', handleResize);

	let terminer = null;
	let selectedTermin = null;
	get('/terminer').then(data => {
		terminer = data;
		selectedTermin = terminer.selected;
	});

	$: ændrerTermin = () => {
		terminer = null;

		get(`/aendre_termin?id=${selectedTermin}`).then(data => {
			if (data.success) terminer.selected = selectedTermin;
			else addNotification('Der skete en fejl ved ændringen af terminet', 'alert-error');
		});

		reloadData();
	};
</script>

<h1 class="heading">Indstillinger - Generelt</h1>

<div class="rounded-lg bg-base-200 p-4">
	<div class="form-control">
		<span class="mb-2 text-lg font-bold">Layout</span>
		<p>Skift imellem sidebar og topbar layout på store skærme</p>
		<label class="label cursor-pointer">
			<span class="label-text">Sidebar</span>
			<input
				type="checkbox"
				class="checkbox"
				on:click={() => {
					location.reload();
				}}
				bind:checked={$indstillinger.sidebar}
				disabled={windowWidth > 768 ? '' : 'disabled'}
			/>
		</label>
		<p class="text-error">{windowWidth < 768 ? 'Ikke understøttet på din enhed' : ''}</p>
	</div>
</div>

<div class="mt-4 rounded-lg bg-base-200 p-4">
	<div class="form-control">
		<span class="mb-2 text-lg font-bold">Opgavesiden</span>

		<label class="label cursor-pointer">
			<span class="label-text">Vis absolut frist</span>
			<input type="checkbox" class="checkbox" bind:checked={$indstillinger.opgaver.visFristAbsolut} />
		</label>

		<label class="label cursor-pointer">
			<span class="label-text">Vis hele opgavenoten</span>
			<input type="checkbox" class="checkbox" bind:checked={$indstillinger.opgaver.visHeleBeskrivelsen} />
		</label>
	</div>
</div>

<div class="mt-4 rounded-lg bg-base-200 p-4">
	<div class="form-control">
		<span class="mb-2 text-lg font-bold">Skemasiden</span>

		<label class="label cursor-pointer">
			<span class="label-text">Få forskellige farver på dine moduler</span>
			<input type="checkbox" class="checkbox" bind:checked={$indstillinger.skema.classesWithDifferentColors} />
		</label>
	</div>
</div>

<div class="mt-4 rounded-lg bg-base-200 p-4">
	<div class="form-control">
		<span class="mb-2 text-lg font-bold">Fag Oversætter</span>
	</div>
	<label class="label cursor-pointer">
		<span class="label-text">Fag Oversætter</span>
		<input type="checkbox" class="checkbox" bind:checked={$indstillinger.brugHoldOversætter} />
	</label>
</div>

<div class="mt-4 rounded-lg bg-base-200 p-4">
	<div class="form-control">
		<span class="mb-2 text-lg font-bold">Termin</span>
		<label class="label cursor-pointer">
			<span class="label-text">Vælg dit termin</span>
			{#if terminer}
				<select
					name="termin"
					id="termin"
					placeholder="Vælg dit termin"
					tabindex="0"
					class="select select-sm py-0"
					bind:value={selectedTermin}
					on:change={ændrerTermin}
				>
					<option value="" disabled selected> Vælg termin </option>
					{#each Object.entries(terminer.terminer) as [terminId, terminName]}
						<option value={terminId}>{terminName}</option>
					{/each}
				</select>
			{:else}
				<span class="loading loading-dots loading-lg" />
			{/if}
		</label>
	</div>
</div>
