<script>
	import BrugerPopup from '$lib/components/BrugerPopup.svelte';
	import { get } from '$lib/js/http';
	import { parseStudentInfo } from '$lib/js/LectioParserUtils';

	const showAllClasses = 'Alle Klasser';
	const allStudents = [];
	let classes = new Set();
	let studentsIndexed = [];
	let studentsInClass = [];
	let usersLoaded = false;
	let searchString = '';
	let selectedClass = showAllClasses;

	get('/informationer').then($informationer => {
		for (const [navn, userId] of Object.entries($informationer.elever)) allStudents.push(parseStudentInfo(navn, userId));

		for (const klasse in $informationer.klasser) classes.add(klasse);
		classes = [...classes].sort((firstItem, secondItem) => firstItem.localeCompare(secondItem));

		studentsIndexed = studentsInClass = allStudents;
		usersLoaded = true;
	});

	function search() {
		studentsIndexed = studentsInClass.filter(({ navn }) => navn.toLowerCase().includes(searchString.toLowerCase()));
	}
	function sortByClass() {
		if (selectedClass === showAllClasses) studentsInClass = allStudents;
		else studentsInClass = allStudents.filter(student => student.klasse === selectedClass);

		search();
	}
</script>

<h1 class="heading">Elevliste</h1>

<div>
	<input
		type="text"
		placeholder="Søg i elevliste"
		class="input-bordered input mb-4 w-full md:w-1/4"
		bind:value={searchString}
		on:input={search}
	/>
	<select class="select select-bordered mb-4 w-full md:w-1/4" bind:value={selectedClass} on:change={sortByClass}>
		<option value={showAllClasses}>{usersLoaded ? showAllClasses : 'Indlæser...'}</option>
		{#if usersLoaded}
			{#each [...classes] as option}
				<option value={option}>{option}</option>
			{/each}
		{/if}
	</select>
</div>
<div class="">
	<table class="table-zebra table-compact table w-full">
		<!-- head -->
		<thead>
			<tr>
				<th />
				<th>Navn</th>
				<th>Klasse</th>
			</tr>
		</thead>
		<tbody>
			{#if usersLoaded}
				{#each studentsIndexed as elev, index}
					<tr>
						<th>{index + 1}</th>
						<td><BrugerPopup navn={elev.navn} id={elev.userId}>{elev.navn}</BrugerPopup></td>
						<td>{elev.klasse}{elev.elevIndeks}</td>
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
</div>
