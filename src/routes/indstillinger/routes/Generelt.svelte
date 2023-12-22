<script>
	import { brugeren, indstillinger } from '$lib/js/store.js';
	import { get, reloadData } from '$lib/js/http.js';
	import { addNotification } from '$lib/js/notifyStore.js';

	get('/mig').then(data => {
		$brugeren = data;
	});

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

	// eslint-disable-next-line init-declarations
	export let dataObj;
</script>

<h1 class="heading">Indstillinger - Generelt</h1>

<div class="rounded-lg bg-base-200 p-4">
	<span class="mb-2 text-lg font-bold">Din Profil</span>
	<div>
		<span>Navn: </span> <span class="font-bold">{$brugeren.navn.split(',')[0]}</span>
	</div>
	<div>
		<span>Klasse: </span> <span class="font-bold">{$brugeren.navn.split(',')[1]}</span>
	</div>
	{#if dataObj.persistantSession}
		<div>
			<span>Brugernavn: </span> <span class="font-bold">{dataObj.persistantSessionUsername}</span>
		</div>
		<div>
			<span>Forbliv logget ind: </span> <span class="font-bold">{dataObj.persistantSession ? 'Ja' : 'Nej'}</span>
		</div>
	{:else}
		<div>
			<span>Brugernavn: </span> <span class="font-bold">Ikke tilgængelig</span>
		</div>
		<div>
			<span>Forbliv logget ind: </span> <span class="font-bold">Nej</span>
		</div>
	{/if}
</div>

<div class="mt-4 rounded-lg bg-base-200 p-4">
	<div class="form-control">
		<span class="mb-2 text-lg font-bold">Layout</span>
		<p>Skift imellem sidebar og topbar layout på store skærme</p>
		<label class="label cursor-pointer">
			<span class="label-text">Sidebar</span>
			<input
				type="checkbox"
				class="toggle"
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
			<input type="checkbox" class="toggle" bind:checked={$indstillinger.opgaver.visFristAbsolut} />
		</label>
		<label class="label cursor-pointer">
			<span class="label-text">Liste (ingen tabel) på mobil</span>
			<input type="checkbox" class="toggle" bind:checked={$indstillinger.opgaver.liste} />
		</label>
	</div>
</div>

<div class="mt-4 rounded-lg bg-base-200 p-4">
	<div class="form-control">
		<span class="mb-2 text-lg font-bold">Skemasiden</span>

		<label class="label cursor-pointer">
			<span class="label-text">Få forskellige farver på dine moduler</span>
			<input type="checkbox" class="toggle" bind:checked={$indstillinger.skema.classesWithDifferentColors} />
		</label>
	</div>
</div>

<div class="mt-4 rounded-lg bg-base-200 p-4">
	<div class="form-control">
		<span class="mb-2 text-lg font-bold">Fag Oversætter</span>
	</div>
	<label class="label cursor-pointer">
		<span class="label-text">Skriver f.eks. "Matematik" istedet for "1a Ma" på moduler</span>
		<input type="checkbox" class="toggle" bind:checked={$indstillinger.brugHoldOversætter} />
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
