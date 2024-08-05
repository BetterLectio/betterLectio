<script lang="ts">
	import AbsenceBlock from './_components/AbsenceBlock.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import { VisSingleContainer, VisNestedDonut } from '@unovis/svelte';
	import { absenceStore, authStore } from '$lib/stores';
	import type { SingleAbsence } from '$lib/types/absence';
	import * as Table from '$lib/components/ui/table';
	import { Progress } from '$lib/components/ui/progress';
	import * as Accordion from '$lib/components/ui/accordion';
	import { NewTabLink } from '$lib/components/links';
	import { decodeUserID } from '$lib/utils';
	import { onMount } from 'svelte';

	type Datum = {
		group: string;
		procent: string;
		value: number;
	};

	const value = (d: Datum) => d.value;
	const layers = [(d: Datum) => d.group];
	const layerSettings = {
		width: 75
	};

	let absenceSplitBySubject: SingleAbsence[] = [];
	let plainAbsenceSplitBySubject: Datum[] = [];
	onMount(async () => {
		await absenceStore.fetch();

		absenceSplitBySubject =
			$absenceStore?.generalt.filter((absence) => absence.hold !== 'Samlet') ?? [];

		plainAbsenceSplitBySubject = absenceSplitBySubject.map((absence) => {
			return {
				group: absence.hold,
				procent: absence.heleåret_fravær_procent,
				value: parseInt(absence.heleåret_fravær_moduler)
			};
		});
		plainAbsenceSplitBySubject.sort((a, b) => b.value - a.value);
	});
</script>

<div class="page-container">
	<h1>Fravær</h1>

	<div class="flex gap-2 *:w-full">
		<AbsenceBlock variant="opgjort" />
		<AbsenceBlock variant="forÅret" />
	</div>

	<Separator />
	<div class="flex flex-col justify-between gap-4 md:flex-row">
		<div class="flex items-center justify-center md:w-1/2">
			<div class="w-fit h-fit">
				<VisSingleContainer data={plainAbsenceSplitBySubject} width="300px">
					<VisNestedDonut {value} {layers} {layerSettings} showBackground="false" />
				</VisSingleContainer>
			</div>
		</div>
		<div class="w-full md:w-1/2">
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Hold</Table.Head>
						<Table.Head>%</Table.Head>
						<Table.Head></Table.Head>
						<Table.Head class="text-right">Moduler</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each plainAbsenceSplitBySubject as { group, procent, value }, i}
						<Table.Row>
							<Table.Cell class="font-medium">{group}</Table.Cell>
							<Table.Cell>{procent}</Table.Cell>
							<Table.Cell>
								<Progress {value} max={plainAbsenceSplitBySubject[0].value} class="w-16 h-2" />
							</Table.Cell>
							<Table.Cell class="text-right">{value} modul{value == 1 ? '' : 'er'}</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>
	</div>
	<Separator />
	<Accordion.Root>
		{#if ($absenceStore?.moduler.manglende_fraværsårsager ?? []).length > 0}
			<Accordion.Item value="item-1">
				<Accordion.Trigger>
					Manglende fraværsårsager: {$absenceStore?.moduler.manglende_fraværsårsager.length}
				</Accordion.Trigger>
				<Accordion.Content>
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head>Modul</Table.Head>
								<Table.Head>Tidspunkt</Table.Head>
								<Table.Head></Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each $absenceStore?.moduler.manglende_fraværsårsager ?? [] as fraværsårsag}
								<Table.Row>
									<Table.Cell>{fraværsårsag.aktivitet.hold}</Table.Cell>
									<Table.Cell>{fraværsårsag.aktivitet.tidspunkt}</Table.Cell>
									<Table.Cell>
										<NewTabLink
											href="https://www.lectio.dk/lectio/{$authStore.school}/fravaer_aarsag.aspx?elevid={decodeUserID(
												$authStore.cookie ?? ''
											)}&id={fraværsårsag.aktivitet.absid}&atype=aa"
										>
											Angiv
										</NewTabLink>
									</Table.Cell>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
				</Accordion.Content>
			</Accordion.Item>
		{/if}
		{#if ($absenceStore?.moduler.oversigt ?? []).length > 0}
			<Accordion.Item value="item-2">
				<Accordion.Trigger>
					fraværsårsager: {$absenceStore?.moduler.oversigt.length}
				</Accordion.Trigger>
				<Accordion.Content>
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head>Modul</Table.Head>
								<Table.Head>Tidspunkt</Table.Head>
								<Table.Head>Årsag</Table.Head>
								<Table.Head>Note</Table.Head>
								<Table.Head></Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each $absenceStore?.moduler.oversigt ?? [] as fraværsårsag}
								<Table.Row>
									<Table.Cell>{fraværsårsag.aktivitet.hold}</Table.Cell>
									<Table.Cell>{fraværsårsag.aktivitet.tidspunkt}</Table.Cell>
									<Table.Cell>{fraværsårsag.årsag}</Table.Cell>
									<Table.Cell>{fraværsårsag.årsagsnote}</Table.Cell>
									<Table.Cell>
										<NewTabLink
											href="https://www.lectio.dk/lectio/{$authStore.school}/fravaer_aarsag.aspx?elevid={decodeUserID(
												$authStore.cookie ?? ''
											)}&id={fraværsårsag.aktivitet.absid}&atype=aa"
										>
											ret
										</NewTabLink>
									</Table.Cell>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
				</Accordion.Content>
			</Accordion.Item>
		{/if}
	</Accordion.Root>
</div>
