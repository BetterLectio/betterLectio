<script lang="ts">
	import { gradesStore } from '$lib/stores';
	import type { GradeSheetEntry, GradeSubject } from '$lib/types/gades';
	import { get } from '$lib/utils';
	import * as Table from '$lib/components/ui/table';
	import GradeCellRenderer from '$lib/components/GradeCellRenderer.svelte';

	$: formatedGrades = formatGradesInTableFormat($gradesStore?.karakterblad ?? []);
	get('/karakterer').then((data) => {
		gradesStore.set(data);
	});

	const formatGradesInTableFormat = (grades: GradeSheetEntry[]) => {
		let standpunktskarakter1 = grades.filter((grade) => grade.type === '1.standpunkt');
		let standpunktskarakter2 = grades.filter((grade) => grade.type === '2.standpunkt');
		let afsluttendeÅrsEllerstandpunktskarakter = grades.filter(
			(grade) => grade.type === 'Afsluttende års-/standpunktskarakter'
		);
		let internPrøveKarakter = grades.filter((grade) => grade.type === 'Intern prøve');
		let Årskarakter = grades.filter((grade) => grade.type === 'Årskarakter');
		let eksamenskarakter = grades.filter((grade) => grade.type === 'Eksamens-/årsprøvekarakter');

		let includedCols: string[] = [];
		if (standpunktskarakter1.length > 0) includedCols.push('1.standpunkt');
		if (standpunktskarakter2.length > 0) includedCols.push('2.standpunkt');
		if (Årskarakter.length > 0) includedCols.push('Årskarakter');
		if (eksamenskarakter.length > 0) includedCols.push('Eksamens karakter');

		console.log(includedCols);

		const sortedGrades = grades.sort((a, b) => {
			if (a.fag < b.fag) {
				return -1;
			}
			if (a.fag > b.fag) {
				return 1;
			}
			return 0;
		});

		console.log(sortedGrades);

		let gradeTable: (string | GradeSheetEntry | null)[][] = Arr2D(
			includedCols.length + 1,
			sortedGrades.length + 1
		);
		gradeTable[0] = ['Fag', ...includedCols];
		let i = 0;
		sortedGrades.forEach((gradeEntry) => {
			i++;
			if (gradeEntry.type == 'Afsl. Standpkt.') gradeEntry.type = 'Årskarakter';
			if (gradeEntry.type == 'Intern prøve') gradeEntry.type = 'Eksamens karakter';
			if (gradeEntry.type == 'Afsluttende års-/standpunktskarakter')
				gradeEntry.type = 'Årskarakter';

			if (gradeEntry.type == 'Eksamenskar.') gradeEntry.type = 'Eksamens karakter';
			const j = includedCols.indexOf(gradeEntry.type);
			console.log(`setting ${gradeEntry} at pos ${i}x ${j}y`);
			if (!Array.isArray(gradeTable[j])) gradeTable[j] = [];
			gradeTable[i][j + 1] = gradeEntry;
			const fag: GradeSheetEntry = gradeEntry;
			gradeTable[i][0] = fag;
		});
		return gradeTable;
	};

	const Arr2D = (cols: number, rows: number) => {
		let arr: any[][] = [];
		for (let i = 0; i < rows; i++) {
			arr[i] = [];
			for (let j = 0; j < cols; j++) {
				arr[i][j] = null;
			}
		}
		return arr;
	};
</script>

<div class="page-container">
	<h1>Karakterer</h1>
	{#if formatedGrades.length > 2}
		<Table.Root>
			<Table.Header>
				<Table.Row>
					{#each formatedGrades[0] as header, i}
						<Table.Head class={i != 0 ? 'text-center' : ''}>{header}</Table.Head>
					{/each}
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each formatedGrades as row, i}
					{#if i != 0}
						<Table.Row>
							{#each row as cell, j}
								<Table.Cell class={j == 0 ? 'max-w-32  break-all ' : 'max-w-6'}>
									<GradeCellRenderer {cell} renderAs={j == 0 ? 'subject' : 'cell'} />
								</Table.Cell>
							{/each}
						</Table.Row>
					{/if}
				{/each}
			</Table.Body>
		</Table.Root>
	{:else}
		<p>Vent venligst men vi henter dit karakterblad...</p>
	{/if}
</div>
