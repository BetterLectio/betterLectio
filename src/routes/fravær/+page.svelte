<script>
	import { ArcElement, CategoryScale, Chart as ChartJS, Legend, Title, Tooltip } from 'chart.js';
	import { fravaer, hold } from '$lib/js/store.js';
	import { Doughnut } from 'svelte-chartjs';
	import PageLoading from '$lib/components/PageLoading.svelte';
	import { addNotification } from '$lib/js/notifyStore.js';
	import { cookieInfo } from '$lib/js/LectioCookieHandler.js';
	import { get } from '$lib/js/http.js';
	import { holdOversætter } from '$lib/js/HoldOversætter.js';
	import moment from 'moment';

	let cookie = null;
	cookieInfo().then(data => {
		cookie = data;
	});

	let BACKGROUND_COLORS = [];

	moment.defineLocale('en-dk', {
		parentLocale: 'en',
		months: ['Januar', 'Februar', 'Marts', 'April', 'Maj', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'December']
	});
	moment.locale('en-dk');

	ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

	const timeRegex
		= /(?<date>(?:[1-9]|[12][0-9]|3[01])\/(?:[1-9]|1[012])-(?:19|20)\d\d) (?<startTime>(?:[01]?[0-9]|2[0-3]):(?:[0-5][0-9])) til (?<endTime>(?:[01]?[0-9]|2[0-3]):(?:[0-5][0-9]))/mu;

	let opgjortFravaer = 0;
	let forÅretFravaer = 0;

	// const BACKGROUND_COLORS = [
	//   "rgb(54, 162, 235)", // blue
	//   "rgb(255, 99, 132)", // red
	//   "rgb(255, 159, 64)", // orange
	//   "rgb(255, 205, 86)", // yellow
	//   "rgb(75, 192, 192)", // green
	//   "rgb(153, 102, 255)", // purple
	// ];

	function makeBackgroundColorArray(length) {
		if (length === 0) return [];
		const colors = [];
		for (let i = 0; i < length; i++) colors.push(`hsl(${Math.round(i / length * 1000)}, 100%, 65%)`);

		return colors;
	}

	let loaded = false;
	get('/fravaer').then(data => {
		try {
			$fravaer = { sort: { col: 'procent', ascending: true }, ...data };
			BACKGROUND_COLORS = makeBackgroundColorArray($fravaer.generalt.length);
			$fravaer.generalt.forEach(element => {
				if (element.hold === 'Samlet') {
					opgjortFravaer = element.opgjort_fravær_procent;
					forÅretFravaer = element.heleåret_fravær_procent;
				}
			});
			$fravaer?.moduler?.oversigt.reverse();

			loaded = true;
		} catch (error) {
			addNotification('Fejl opstod ved hentning af fravær', 'alert-error');
		}
	});

	const monthToFravær = {};
	$: if ($fravaer) {
		const concFravær = [...$fravaer.moduler.manglende_fraværsårsager, ...$fravaer.moduler.oversigt];
		const months = moment.months();

		// Shift månederne til at starte ved skolestart (august)
		for (let i = 0; i < 7; i++) months.push(months.shift());
		months.map(monthName => (monthToFravær[monthName] = 0));

		for (let i = 0; i < concFravær.length; i++) {
			const modul = concFravær[i].aktivitet;
			const timeMatch = modul.tidspunkt.match(timeRegex);
			const { date, endTime } = timeMatch.groups;
			const momentTime = moment(`${date} ${endTime}`, 'DD/MM-YYYY HH:mm');
			monthToFravær[momentTime.format('MMMM')] = monthToFravær[momentTime.format('MMMM')] + 1;
		}
	}

	let overblikType = 'Opgjort';

	$: sort = col => {
		const column = col ?? $fravaer.sort.col;
		if (col !== undefined) {
			if ($fravaer.sort.col === column) {
				$fravaer.sort.ascending = !$fravaer.sort.ascending;
			} else {
				$fravaer.sort.col = column;
				$fravaer.sort.ascending = true;
			}
		}
		const sortModifier = $fravaer.sort.ascending ? 1 : -1;
		const parseProcent = procent => parseFloat(procent.replace(',', '.'));
		const sortFunc = (firstElem, secondElem) => {
			const isOpgjort = overblikType === 'Opgjort';

			const [, firstModulerValue] = /(?:(?:[0-9]+,)?[0-9]+)\//gu.exec(isOpgjort ? firstElem.opgjort_fravær_moduler : firstElem.heleåret_fravær_moduler) ?? [null, null];
			const [, secondModulerValue] = /(?:(?:[0-9]+,)?[0-9]+)\//gu.exec(isOpgjort ? secondElem.opgjort_fravær_moduler : secondElem.heleåret_fravær_moduler) ?? [null, null];

			const firstPercentValue = parseProcent(isOpgjort ? firstElem.opgjort_fravær_procent : firstElem.heleåret_fravær_procent);
			const secondPercentValue = parseProcent(isOpgjort ? secondElem.opgjort_fravær_procent : secondElem.heleåret_fravær_procent);

			switch (column) {
			case 'procent':
				if (firstPercentValue < secondPercentValue) return -1 * sortModifier;
				return firstPercentValue > secondPercentValue ? Number(sortModifier) : 0;
			case 'moduler':
				if (firstModulerValue < secondModulerValue) return -1 * sortModifier;
				return firstModulerValue > secondModulerValue ? Number(sortModifier) : 0;
			case 'hold':
				if (firstElem.hold < secondElem.hold) return -1 * sortModifier;
				return firstElem.hold > secondElem.hold ? Number(sortModifier) : 0;
			default: return null;
			}
		};
		$fravaer.generalt = $fravaer.generalt.sort(sortFunc);
	};
	$: sortArrow = (column, sortInfo) => {
		if (column === sortInfo?.col) return sortInfo?.ascending ? '▲' : '▼';

		return '';
	};
	$: monthsWithFravær = Object.values(monthToFravær)
		.reduce((acc, fravær) => acc + Math.min(fravær, 1), 0);
</script>

<h1 class="heading">Fravær</h1>

{#if loaded}
	<div class="stats mb-4 bg-base-200 shadow">
		<div class="stat">
			<div class="stat-title">Opgjort</div>
			<div class="stat-value {opgjortFravaer ? '' : 'animate-pulse'}">{opgjortFravaer || '--,-%'}</div>
		</div>
		<div class="stat">
			<div class="stat-title">For hele året</div>
			<div class="stat-value {forÅretFravaer ? '' : 'animate-pulse'}">{forÅretFravaer || '--,-%'}</div>
		</div>
	</div>
	<div class="flex w-full flex-col rounded-lg bg-base-200 p-4 lg:flex-row">
		<div class="w-full rounded-lg bg-base-300 p-4 lg:w-1/2">
			<h2 class="text-2xl font-bold">Grafisk oversigt</h2>
			{#if $fravaer && $fravaer?.generalt}
				{#if $fravaer.generalt.find(item => item.hold === 'Samlet').heleåret_fravær_procent === '0,00%'}
					<p class="mt-4">Du har ikke noget fravær</p>
				{:else}
					<Doughnut
						data={{
							labels: $fravaer.generalt
								.filter(element => element.hold !== 'Samlet' && element.opgjort_fravær_procent !== '0,00%')
								.map(element => element.hold),
							datasets: [
								{
									borderWidth: 0,
									hoverOffset: 20,
									label: 'Fraværende moduler',
									data: $fravaer.generalt
										.filter(element => element.hold !== 'Samlet' && element.opgjort_fravær_procent !== '0,00%')
										.map(element => /(?<_>\d+,?\d*|,\d+)\//gu.exec(element.opgjort_fravær_moduler)[1].replace(',', '.')),
									backgroundColor: $fravaer.generalt.map((_element, index) => BACKGROUND_COLORS[index % BACKGROUND_COLORS.length])
								}
							]
						}}
					/>
				{/if}
			{/if}

			{#if monthsWithFravær >= 2}
				<Doughnut
					data={{
						labels: Object.keys(monthToFravær),
						datasets: [
							{
								label: 'Registreret fravær',
								data: Object.values(monthToFravær),
								backgroundColor: Object.values(monthToFravær).map((_element, index) => BACKGROUND_COLORS[index % BACKGROUND_COLORS.length])
							}
						]
					}}
				/>
			{/if}
		</div>
		<div class="mt-4 w-full overflow-y-scroll rounded-lg bg-base-300 p-4 lg:ml-4 lg:mt-0">
			<h2 class="mb-4 text-2xl font-bold">Manglende fraværsårsager</h2>
			{#if $fravaer?.moduler?.manglende_fraværsårsager.length}
				<div class="overflow-x-auto">
					<table class="table-zebra table w-full">
						<!-- head -->
						<thead>
							<tr>
								<th>modul</th>
								<th>dato</th>
								<th />
							</tr>
						</thead>
						<tbody>
							{#if $fravaer?.moduler?.manglende_fraværsårsager}
								{#each $fravaer.moduler.manglende_fraværsårsager as modul}
									<tr>
										<td>{modul.aktivitet.navn ? holdOversætter(modul.aktivitet.hold, $hold) : modul.aktivitet.navn}</td>
										<td>{modul.aktivitet.tidspunkt}</td>
										<td>
											<a
												href={`https://www.lectio.dk/lectio/${
													cookie?.schoolId
												}/fravaer_aarsag.aspx?elevid=${
													cookie?.userId
												}&id=${
													modul?.aktivitet?.absid
												}&atype=aa`}
												class="btn-xs btn">Skriv fraværsårsag</a
											></td
										>
									</tr>
								{/each}
							{/if}
						</tbody>
					</table>
				</div>
			{:else}
				<p>Du har ingen manglende fraværsårsager</p>
			{/if}
		</div>
	</div>
	<div class="mt-4 rounded-lg bg-none p-0 lg:bg-base-200 lg:p-4">
		<h2 class="mb-2 text-2xl font-bold">Fraværsårsager</h2>
		<table class="table-zebra table-compact table hidden w-full lg:inline-table">
			<!-- head -->
			<thead>
				<tr>
					<th>Fag</th>
					<th>Navn</th>
					<th>Fravær</th>
					<th>Dato</th>
					<th>Årsag</th>
					<th>Årsagsnote</th>
				</tr>
			</thead>
			<tbody>
				{#if $fravaer?.moduler?.oversigt}
					{#each $fravaer.moduler.oversigt as modul}
						<tr>
							<td>{!modul.aktivitet.hold ? '' : holdOversætter(modul.aktivitet.hold, $hold)}</td>
							<td>{!modul.aktivitet.navn ? '' : modul.aktivitet.navn}</td>
							<td>{modul.fravær}</td>

							<td>{modul.aktivitet.tidspunkt}</td>
							<td>
								{#if modul.årsag === 'Sygdom'}
									<p class="btn-warning btn-xs btn w-full">{modul.årsag}</p>
								{:else if modul.årsag === 'Private forhold'}
									<p class="btn-info btn-xs btn w-full">{modul.årsag}</p>
								{:else if modul.årsag === 'Skolerelaterede aktiviteter'}
									<p class="btn-success btn-xs btn w-full">{modul.årsag}</p>
								{:else if modul.årsag === 'Kom for sent'}
									<p class="btn-error btn-xs btn w-full">{modul.årsag}</p>
								{:else if modul.årsag === 'Andet'}
									<p class="btn-xs btn w-full">{modul.årsag}</p>
								{/if}
							</td>
							<td class="whitespace-pre-wrap">{modul.årsagsnote}</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
		<div class="list lg:hidden">
			{#if $fravaer?.moduler?.oversigt}
				{#each $fravaer.moduler.oversigt as modul}
					{#if modul.årsag === 'Sygdom'}
						<div class="element border-l-4 !rounded-l-none border-l-warning">
							<p class="text-sm font-light">{modul.aktivitet.tidspunkt}</p>
							<p>
								<strong>{modul.aktivitet.hold ? '' : holdOversætter(modul.aktivitet.hold, $hold)}</strong>
								{modul.årsag}
							</p>
							<p>{modul.årsagsnote}</p>
						</div>
					{:else if modul.årsag === 'Private forhold'}
						<div class="element border-l-4 !rounded-l-none border-l-info">
							<p class="text-sm font-light">{modul.aktivitet.tidspunkt}</p>
							<p>
								<strong>{modul.aktivitet.hold ? '' : holdOversætter(modul.aktivitet.hold, $hold)}</strong>
								{modul.årsag}
							</p>
							<p>{modul.årsagsnote}</p>
						</div>
					{:else if modul.årsag === 'Skolerelaterede aktiviteter'}
						<div class="element border-l-4 !rounded-l-none border-l-success">
							<p class="text-sm font-light">{modul.aktivitet.tidspunkt}</p>
							<p>
								<strong>{modul.aktivitet.hold ? '' : holdOversætter(modul.aktivitet.hold, $hold)}</strong>
								{modul.årsag}
							</p>
							<p>{modul.årsagsnote}</p>
						</div>
					{:else if modul.årsag === 'Kom for sent'}
						<div class="element border-l-4 border-l-error">
							<p class="text-sm font-light">{modul.aktivitet.tidspunkt}</p>
							<p>
								<strong>{modul.aktivitet.hold ? '' : holdOversætter(modul.aktivitet.hold, $hold)}</strong>
								{modul.årsag}
							</p>
							<p>{modul.årsagsnote}</p>
						</div>
					{:else if modul.årsag === 'Andet'}
						<div class="element">
							<p class="text-sm font-light">{modul.aktivitet.tidspunkt}</p>
							<p>
								<strong>{modul.aktivitet.hold ? '' : holdOversætter(modul.aktivitet.hold, $hold)}</strong>
								{modul.årsag}
							</p>
							<p>{modul.årsagsnote}</p>
						</div>
					{/if}
				{/each}
			{/if}
		</div>
	</div>

	<div class="mt-4 rounded-lg bg-none p-0 lg:bg-base-200 lg:p-4">
		<h2 class="mb-2 text-2xl font-bold">Overblik</h2>
		<p class="mb-2">Hold uden fravær er ikke vist.</p>
		<div class="tabs justify-center">
			<button
				on:click={() => {
					overblikType = 'Opgjort';
					sort();
				}}
				class="tab tab-lifted {overblikType === 'Opgjort' ? 'tab-active' : ''}">Opgjort</button
			>
			<button
				on:click={() => {
					overblikType = 'Hele året';
					sort();
				}}
				class="tab tab-lifted {overblikType === 'Hele året' ? 'tab-active' : ''}">Hele året</button
			>
		</div>
		<table class="table-zebra table-compact table w-full lg:inline-table">
			<!-- head -->
			<thead>
				<tr>
					<th on:click={sort('hold')}>Fag {sortArrow('hold', $fravaer?.sort)}</th>
					<th on:click={sort('procent')}>Fravær {sortArrow('procent', $fravaer?.sort)}</th>
					<th on:click={sort('moduler')}>Moduler {sortArrow('moduler', $fravaer?.sort)}</th>
				</tr>
			</thead>
			<tbody>
				{#if $fravaer?.generalt}
					{#each $fravaer.generalt as fravaerhold}
						{#if fravaerhold?.hold !== 'Samlet' && (overblikType === 'Opgjort' ? fravaerhold?.opgjort_fravær_procent : fravaerhold?.heleåret_fravær_procent) !== '0,00%'}
							<tr>
								<td>{holdOversætter(fravaerhold?.hold, $hold)}</td>
								<td>{overblikType === 'Opgjort' ? fravaerhold?.opgjort_fravær_procent : fravaerhold?.heleåret_fravær_procent}</td>
								<td>{overblikType === 'Opgjort' ? fravaerhold?.opgjort_fravær_moduler : fravaerhold?.heleåret_fravær_moduler}</td>
							</tr>
						{/if}
					{/each}
					<!-- Mess but easiest way to get "Samlet" always at bottom (after sorting) -->
					{#each $fravaer?.generalt as fravaerhold}
						{#if fravaerhold?.hold === 'Samlet'}
							<tr>
								<td>{fravaerhold?.hold}</td>
								<td>{overblikType === 'Opgjort' ? fravaerhold?.opgjort_fravær_procent : fravaerhold?.heleåret_fravær_procent}</td>
								<td>{overblikType === 'Opgjort' ? fravaerhold?.opgjort_fravær_moduler : fravaerhold?.heleåret_fravær_moduler}</td>
							</tr>
						{/if}
					{/each}
				{/if}
			</tbody>
		</table>
	</div>
{:else}
	<PageLoading></PageLoading>
{/if}
