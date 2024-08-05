<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Progress } from '$lib/components/ui/progress';
	import { absenceStore } from '$lib/stores';
	import type { RawAbsence, SingleAbsence } from '$lib/types/absence';
	import { get } from '$lib/utils/http';

	export let variant: 'opgjort' | 'forÅret' = 'opgjort';

	let generalAbsence: SingleAbsence | undefined = undefined;
	get('/fravaer').then((data: RawAbsence) => {
		absenceStore.set(data);
		console.log(data);
		generalAbsence = $absenceStore?.generalt.find((absence) => absence.hold == 'Samlet');
	});
</script>

{#if variant === 'opgjort'}
	<Card.Root class="">
		<Card.Header class="pb-2">
			<Card.Description>Fysisk fravær, for året</Card.Description>
			<Card.Title class="text-4xl">{generalAbsence?.heleåret_fravær_procent || '0%'}</Card.Title>
		</Card.Header>
		<Card.Content>
			<div class="text-xs text-muted-foreground">
				{generalAbsence?.heleåret_fravær_moduler || '0/0'} moduler
			</div>
		</Card.Content>
		<Card.Footer>
			<Progress
				class={parseInt(generalAbsence?.heleåret_fravær_procent || '0') > 8
					? '*:bg-destructive'
					: ''}
				value={parseInt(generalAbsence?.heleåret_fravær_procent || '0')}
				aria-label={parseInt(generalAbsence?.heleåret_fravær_procent || '0').toString()}
				max={10}
			/>
		</Card.Footer>
	</Card.Root>
{:else if variant === 'forÅret'}
	<Card.Root class="">
		<Card.Header class="pb-2">
			<Card.Description>Fysisk fravær, opgjort</Card.Description>
			<Card.Title class="text-4xl">{generalAbsence?.opgjort_fravær_procent || '0%'}</Card.Title>
		</Card.Header>
		<Card.Content>
			<div class="text-xs text-muted-foreground">
				{generalAbsence?.opgjort_fravær_moduler || '0/0'} moduler
			</div>
		</Card.Content>
		<Card.Footer>
			<Progress
				class={parseInt(generalAbsence?.opgjort_fravær_procent || '0') > 8
					? '*:bg-destructive'
					: ''}
				value={parseInt(generalAbsence?.opgjort_fravær_procent || '0')}
				aria-label={parseInt(generalAbsence?.opgjort_fravær_procent || '0').toString()}
				max={10}
			/>
		</Card.Footer>
	</Card.Root>
{/if}
