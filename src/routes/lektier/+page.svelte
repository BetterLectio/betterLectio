<script>
	import LektieCard from '$lib/components/LektieCard.svelte';
	import { get } from '$lib/js/http.js';
	import { lektier } from '$lib/js//store.js';
	import moment from 'moment';

	let ready = false;

	moment.defineLocale('en-DK', {
		months: [
			'Januar',
			'Februar',
			'Marts',
			'April',
			'Maj',
			'Juni',
			'Juli',
			'August',
			'September',
			'Oktober',
			'November',
			'December'
		],
		weekdays: [
			'Søndag',
			'Mandag',
			'Tirsdag',
			'Onsdag',
			'Torsdag',
			'Fredag',
			'Lørdag'
		]
	});
	const timeRegex
		= /(?<date>(?:[1-9]|[12][0-9]|3[01])\/(?:[1-9]|1[012])-(?:19|20)\d\d) (?<startTime>(?:[01]?[0-9]|2[0-3]):(?:[0-5][0-9])) til (?<endTime>(?:[01]?[0-9]|2[0-3]):(?:[0-5][0-9]))/mu;

	get('/lektier').then(data => {
		data.forEach((lektie, index) => {
			const timeMatch = timeRegex.exec(lektie.aktivitet.tidspunkt);
			const { date, endTime } = timeMatch.groups;
			const momentTime = moment(`${date} ${endTime}`, 'D/M-YYYY HH:mm');

			let time = '';
			if (momentTime.isSame(moment(), 'day')) time = 'I dag';
			else if (momentTime.isSame(moment().add(1, 'day'), 'day')) time = 'I morgen';
			else time = momentTime.format('dddd D. MMMM');

			data[index].internalDate = time;
		});
		$lektier = data;
		ready = true;
	});

	function seperateAssignmentsByDate() {
		const datoer = [];
		$lektier.forEach(lektie => {
			if (!datoer.includes(lektie.internalDate)) datoer.push(lektie.internalDate);
		});
		return datoer;
	}
</script>

{#if ready}
	<h1 class="heading">Lektier</h1>
	<h3 class="mb-4 text-xl">Lektier for de næste 14 dage</h3>
	{#if $lektier.length > 0}
		{#each Object.values(seperateAssignmentsByDate()) as day}
			<h2 class="mb-2 mt-4 text-lg font-bold">{day}</h2>
			<ul>
				{#each $lektier as lektie}
					{#if lektie.internalDate === day}
						<LektieCard {lektie} />
					{/if}
				{/each}
			</ul>
		{/each}
	{:else}
		<p>Du har ingen kommende lektier de næste 14 dage</p>
	{/if}
{/if}
