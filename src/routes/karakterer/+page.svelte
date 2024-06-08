<script lang="ts">
	import { gradesStore } from '$lib/stores';
	import type { GradeLine } from '$lib/types/grades';
	import { get } from '$lib/utils';
	import * as Table from '$lib/components/ui/table';
	import GradeCellRenderer from '$lib/components/GradeCellRenderer.svelte';

	const cols = ['Fag', '1. stdpkt.', '2. stdpkt.', 'årskarakter', 'eksamen'];
	$: sortedKeys = sortRows($gradesStore?.karakterer || {});

	get('/karakterer').then((data) => {
		gradesStore.set(data);
		console.log(data);
	});

	function sortRows(data: { [key: string]: GradeLine }) {
		return Object.values(data).sort((a, b) => {
			if (a.fag < a.fag) {
				return -1;
			}
			if (a.fag > a.fag) {
				return 1;
			}
			return 0;
		});
	}
</script>

<div class="page-container">
	<h1>Karakterer</h1>
	{#if sortedKeys.length > 2}
		<Table.Root>
			<Table.Header>
				<Table.Row>
					{#each cols as header, i}
						<Table.Head class={i != 0 ? 'text-center' : ''}>{header}</Table.Head>
					{/each}
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each sortedKeys || [] as key, i}
					{#if i != 0}
						<Table.Row>
							<Table.Cell class="p-1 break-all min-w-32">
								<GradeCellRenderer cell={key} renderAs={'subject'} />
							</Table.Cell>
							<Table.Cell class="p-1 max-w-6">
								<GradeCellRenderer cell={key} renderAs={'cell'} kind={'1.standpunkt'} />
							</Table.Cell>
							<Table.Cell class="p-1 max-w-6">
								<GradeCellRenderer cell={key} renderAs={'cell'} kind={'2.standpunkt'} />
							</Table.Cell>
							<Table.Cell class="p-1 max-w-6">
								<GradeCellRenderer
									cell={key}
									renderAs={'cell'}
									kind={['afsluttende års-/standpunktskarakter', 'årskarakter']}
								/>
							</Table.Cell>
							<Table.Cell class="p-1 max-w-6">
								<GradeCellRenderer
									cell={key}
									renderAs={'cell'}
									kind={['eksamens-/årsprøvekarakter', 'intern prøve']}
								/>
							</Table.Cell>
						</Table.Row>
					{/if}
				{/each}
			</Table.Body>
		</Table.Root>
	{:else}
		<p>Vent venligst men vi henter dit karakterblad...</p>
	{/if}
</div>
