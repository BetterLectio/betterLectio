<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { authStore } from '$lib/stores';
	import { get } from '$lib/utils';
	import { onMount } from 'svelte';
	import type { ExamData, Participant } from '$lib/types/exam';
	import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import { toTitleCase } from '$lib/utils';
	import { createTable, Render, Subscribe } from 'svelte-headless-table';
	import { type Writable, writable } from 'svelte/store';
	import { addSortBy } from 'svelte-headless-table/plugins';
	import ArrowDown from 'lucide-svelte/icons/arrow-down';
	import ArrowUp from 'lucide-svelte/icons/arrow-up';
	import ArrowUpDown from 'lucide-svelte/icons/arrow-up-down';

	const id = $page.url.searchParams.get('id');
	const name = $page.url.searchParams.get('navn');

	let exam: ExamData | null = null;
	const participants: Writable<Participant[]> = writable([]);
	let participant: Participant | undefined = undefined;

	onMount(async () => {
		exam = await get(`/eksamen?id=${id}`);

		if (exam) {
			const parts: Participant[] = [];
			exam.participants.forEach(p => {
				parts.push({
					navn: p.navn,
					elev_id: p.elev_id,
					eks_dato: p.eks_dato,
					forb: p.forb,
					eks_start: p.eks_start,
					eks_slut: p.eks_slut,
					klasse: p.klasse
				});
			});
			exam.participants = parts;
			$participants = parts;
			if (name)
				participant = parts.find(p => p.navn === name);
		}
	});

	const unSnakeCase = (str: string) => toTitleCase(str.replace(/_/g, ' '));

	const table = createTable(participants, {
		sort: addSortBy({
			initialSortKeys: [{ id: 'eks_dato', order: 'asc' }, { id: 'eks_start', order: 'asc' }]
		})
	});
	const columns = table.createColumns([
		table.column({ accessor: 'elev_id', header: 'ID' }),
		table.column({ accessor: 'navn', header: 'Navn' }),
		table.column({ accessor: 'eks_dato', header: 'Dato' }),
		table.column({ accessor: 'forb', header: 'Forb' }),
		table.column({ accessor: 'eks_start', header: 'Start' }),
		table.column({ accessor: 'eks_slut', header: 'Slut' })
	]);
	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns);
	const { sortKeys } = pluginStates.sort;
</script>

<div class="page-container">
	<div class="lg:flex lg:justify-between">
		{#if exam}
			<h1>{exam.info.prøvehold} - {exam.info.prøvetype}</h1>
		{:else}
			<h1>Loading...</h1>
		{/if}
		<Button
			variant="outline"
			href={`https://www.lectio.dk/lectio/${$authStore.school}/proevehold.aspx?type=proevehold&ProeveholdId=${id}`}
			target="_blank">Åben i Lectio
		</Button
		>
	</div>

	{#if exam}
		{#if participant}
			<Card level="2">
				<CardHeader>
					<CardTitle>{participant.navn} ({participant.elev_id})</CardTitle>
					<CardDescription>{exam.info.prøvetype}</CardDescription>
				</CardHeader>
				<CardContent>
					<div class="grid gap-10 grid-cols-[repeat(auto-fit,minmax(100px,1fr))]">
						{#each Object.keys(participant) as key}
							{#if key !== 'navn' && key !== 'elev_id'}
								<dl>
									<dt class="text-muted-foreground text-sm">{unSnakeCase(key)}</dt>
									<dd>{participant[key]}</dd>
								</dl>
							{/if}
						{/each}
					</div>
				</CardContent>
				<CardFooter class="text-sm text-muted-foreground">
					Altid tjek tidspunkter efter i Lectio. Vi påtager os intet ansvar for forkert information.
				</CardFooter>
			</Card>
		{/if}

		<div class="rounded-md border">
			<Table.Root {...$tableAttrs}>
				<Table.Header>
					{#each $headerRows as headerRow}
						<Subscribe rowAttrs={headerRow.attrs()}>
							<Table.Row>
								{#each headerRow.cells as cell (cell.id)}
									<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
										<Table.Head {...attrs}>
											<Button variant="ghost" on:click={props.sort.toggle}>
												<Render of={cell.render()} />
												{#if $sortKeys.find(k => k.id === cell.id)}
													{#if $sortKeys.find(k => k.id === cell.id)?.order === 'asc'}
														<ArrowUp class="ml-2 size-4" />
													{:else}
														<ArrowDown class="ml-2 size-4" />
													{/if}
												{:else}
													<ArrowUpDown class="ml-2 size-4" />
												{/if}
											</Button>
										</Table.Head>
									</Subscribe>
								{/each}
							</Table.Row>
						</Subscribe>
					{/each}
				</Table.Header>
				<Table.Body {...$tableBodyAttrs}>
					{#each $pageRows as row (row.id)}
						<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
							<Table.Row {...rowAttrs}>
								{#each row.cells as cell (cell.id)}
									<Subscribe attrs={cell.attrs()} let:attrs>
										<Table.Cell {...attrs}>
											<Render of={cell.render()} />
										</Table.Cell>
									</Subscribe>
								{/each}
							</Table.Row>
						</Subscribe>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>
	{/if}
</div>
