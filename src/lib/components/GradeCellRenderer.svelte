<script lang="ts">
	import type { GradeSheetEntry, GradeSubject } from '$lib/types/gades';

	export let cell: string | GradeSheetEntry | null;
	export let renderAs: 'cell' | 'subject';
</script>

{#if renderAs == 'cell' && typeof cell == 'object'}
	<div
		class="flex flex-col items-center justify-center {cell?.karakter == '12'
			? 'text-green-500'
			: ''}"
	>
		<p class="text-center">{cell?.karakter || ''}</p>
		{#if cell?.karakter}
			<p class="text-xs text-center opacity-50">
				{parseFloat(cell?.vægtning.replace(',', '.') || '1').toFixed(2)}
			</p>
		{/if}
	</div>
{:else if renderAs == 'subject' && typeof cell == 'object'}
	<div class="flex flex-col items-start justify-center">
		<p>{cell?.fag}</p>
		<p class="text-xs opacity-50">
			{cell?.evalueringsform == 'Samlet vurdering' ? 'Samlet' : cell?.evalueringsform}
		</p>
	</div>
{:else}
	<p></p>
{/if}
