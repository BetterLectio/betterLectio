<script>
	import PageLoading from '$lib/components/PageLoading.svelte';
	import { fravaer } from '$lib/js/store.js';
	import { get } from '$lib/js/http.js';

	const defaultDesiredAmount = 10;
	let desiredAmount = defaultDesiredAmount;
	const fravaerData = {};
	const decimalPercentRatio = 100;
	let fravaerType = 'Opgjort';

	function getData() {
		if ($fravaer?.generalt) {
			$fravaer.generalt.forEach(element => {
				if (element.hold === 'Samlet') {
					fravaerData.matches = /(?<_>\d+,?\d*|,\d+)\/(?<__>\d+,?\d*|,\d+)/gu.exec(element[`${fravaerType.toLowerCase().replace(' ', '') }_fravær_moduler`]);
					fravaerData.currentClasses = Number(fravaerData.matches[1].replace(',', '.'));
					fravaerData.totalClasses = Number(fravaerData.matches[2]);
					fravaerData.currentFravær = fravaerData.currentClasses / fravaerData.totalClasses * decimalPercentRatio;
					fravaerData.possibleAmount = Math.floor(fravaerData.totalClasses * (desiredAmount / decimalPercentRatio));
				}
			});
		}
	}

	get('/fravaer').then(data => {
		$fravaer = data;
		getData();
	});

	getData();

	const updateDesired = () => {
		fravaerData.possibleAmount = Math.floor(fravaerData.totalClasses * (desiredAmount / decimalPercentRatio));
	};
</script>

<h1 class="heading">Fraværsudregner</h1>

{#if !$fravaer}
	<PageLoading></PageLoading>
{:else}
	<label for="procent-range" class="mb-2 block font-medium">Hvor meget procent fravær vil du ende med?</label>
	<input on:input={updateDesired} bind:value={desiredAmount} id="procent-range" type="range" class="range range-primary" />

	<ul class="mt-2 flex flex-wrap text-center text-sm font-medium text-gray-500 dark:text-gray-400">
		<li class="mr-2">
			<button
				on:click={() => {
					fravaerType = 'Hele året';
					getData();
				}}
				class="inline-block rounded-lg px-4 py-3 {fravaerType === 'Hele året'
					? 'bg-primary text-white'
					: 'hover:bg-primary-focus hover:text-gray-900 dark:hover:text-white'}">Hele året</button
			>
		</li>
		<li class="mr-2">
			<button
				on:click={() => {
					fravaerType = 'Opgjort';
					getData();
				}}
				class="inline-block rounded-lg px-4 py-3 {fravaerType === 'Opgjort'
					? 'bg-primary text-white'
					: 'hover:bg-primary-focus hover:text-gray-900 dark:hover:text-white'}">Opgjort</button
			>
		</li>
	</ul>

	<div class="flex">
		<div class="mt-2 w-full max-w-xl rounded-lg bg-base-200 p-4 sm:p-6 md:p-8">
			<h2 class="text-2xl font-bold">{fravaerType}</h2>

			{#if fravaerData}
				<p class="mt-2 text-xl lg:text-2xl">Du vil ende med <span class="font-bold">{desiredAmount}%</span> fravær</p>
				<p class="mt-2 text-xl lg:text-2xl">
					Så kan du i alt pjække <span class="font-bold">{fravaerData.possibleAmount.toLocaleString('da')}</span> moduler
				</p>
				{#if fravaerData.possibleAmount - fravaerData.currentClasses < 0}
					<p class="mt-2 text-xl lg:text-2xl">
						Du har allerede pjækket <span class="font-bold"
						>{Math.abs(fravaerData.possibleAmount - fravaerData.currentClasses).toLocaleString('da')}</span
						>
						moduler for meget
					</p>
				{:else}
					<p class="mt-2 text-xl lg:text-2xl">
						Du kan pjække <span class="font-bold">{(fravaerData.possibleAmount - fravaerData.currentClasses).toLocaleString('da')}</span> moduler
						mere
					</p>
				{/if}
				<br />
				<h2 class="text-2xl font-bold">Nuværende</h2>
				<p class="mt-2 text-xl">
					Antal moduler fraværende: <span class="font-bold">{fravaerData.currentClasses.toLocaleString('da')}</span>
				</p>
				<p class="mt-2 text-xl">
					Totalt antal moduler: <span class="font-bold">{fravaerData.totalClasses.toLocaleString('da')}</span>
				</p>
				<p class="mt-2 text-xl">
					Fravær procent: <span class="font-bold">{(Math.round(fravaerData.currentFravær * 100) / 100).toLocaleString('da')}%</span>
				</p>
			{/if}
		</div>
	</div>
{/if}
