<script lang="ts">
	import type { GradeLine, RawGrade } from '$lib/types/grades';
	import * as Table from '$lib/components/ui/table';

	type weightedGrade = {
		grade: number;
		weight: number;
	};

	let gradeCols: weightedGrade[][] = [[], [], [], []];

	export let grades: GradeLine[];

	grades.forEach((grade) => {
		if (grade['1.standpunkt'])
			gradeCols[0].push({
				grade: parseInt(grade['1.standpunkt']),
				weight: parseFloat(grade?.vægtning.replace(',', '.') || '1')
			});
		if (grade['2.standpunkt'])
			gradeCols[1].push({
				grade: parseInt(grade['2.standpunkt']),
				weight: parseFloat(grade?.vægtning.replace(',', '.') || '1')
			});
		if (grade['afsluttende års-/standpunktskarakter'] || grade['årskarakter'])
			gradeCols[2].push({
				grade: parseInt(grade['afsluttende års-/standpunktskarakter'] || grade['årskarakter']),
				weight: parseFloat(grade?.vægtning.replace(',', '.') || '1')
			});
		if (grade['eksamens-/årsprøvekarakter'] || grade['intern prøve'])
			gradeCols[3].push({
				grade: parseInt(grade['eksamens-/årsprøvekarakter'] || grade['intern prøve']),
				weight: parseFloat(grade?.vægtning.replace(',', '.') || '1')
			});
	});

	let averages = [];
	for (let i = 0; i < 4; i++) {
		averages[i] =
			gradeCols[i].reduce((acc, curr) => acc + curr.grade * curr.weight, 0) /
			gradeCols[i].reduce((acc, curr) => acc + curr.weight, 0);
	}
</script>

<Table.Row class="bg-secondary">
	<Table.Cell class="p-1 text-xs">Gennemsnit</Table.Cell>
	{#each averages as average}
		<Table.Cell class="p-1 max-w-6">
			<div class="flex flex-col items-center justify-center">
				{average.toFixed(2)}
			</div>
		</Table.Cell>
	{/each}
</Table.Row>
