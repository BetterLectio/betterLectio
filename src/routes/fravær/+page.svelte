<script lang="ts">
	import AbsenceBlock from '$lib/components/AbsenceBlock.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { VisSingleContainer, VisNestedDonut } from '@unovis/svelte';
	import { absenceStore } from '$lib/stores';
	import type { RawAbsence, SingleAbsence } from '$lib/types/absence';
	import { get } from '$lib/utils/http';
	import { NestedDonutDirection } from '@unovis/ts';

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

	let absence: RawAbsence | undefined = undefined;
	let absenceSplitBySubject: SingleAbsence[] = [];
	let plainAbsenceSplitBySubject: Datum[] = [];
	let ready = false;
	get('/fravaer').then((data: RawAbsence) => {
		absenceStore.set(data);
		absence = data;

		absenceSplitBySubject = absence?.generalt.filter((absence) => absence.hold !== 'Samlet') ?? [];

		plainAbsenceSplitBySubject = absenceSplitBySubject.map((absence) => {
			return {
				group: absence.hold,
				procent: absence.heleåret_fravær_procent,
				value: parseInt(absence.heleåret_fravær_moduler)
			};
		});
		plainAbsenceSplitBySubject.sort((a, b) => b.value - a.value);
		ready = true;
	});
</script>

<div class="page-container">
	<h1>Fravær</h1>

	<div class="flex gap-2 *:w-full">
		<AbsenceBlock variant="opgjort" />
		<AbsenceBlock variant="forÅret" />
	</div>

	<Separator />
	{#if ready}
		<div class="flex justify-start">
			<div class="aspect-square">
				<VisSingleContainer data={plainAbsenceSplitBySubject}>
					<VisNestedDonut {value} {layers} {layerSettings} />
				</VisSingleContainer>
			</div>
			<div>
				<ol>
					{#each plainAbsenceSplitBySubject as { group, procent, value }, i}
						<li>
							{group} - {procent} ({value} moduler)
						</li>
					{/each}
				</ol>
			</div>
		</div>
	{/if}
</div>

<!--
	til resten bruges:
	https://unovis.dev/docs/misc/Donut

	det burde virke med svelte ret lækkert

	vi skal også lige lave fraværsårsag på api'en

-->
