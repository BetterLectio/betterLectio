<script lang="ts">
	import type { GradeLine } from '$lib/types/grades';

	export let cell: GradeLine | null;
	export let renderAs: 'cell' | 'subject';
	export let kind:
		| '1.standpunkt'
		| '2.standpunkt'
		| 'afsluttende års-/standpunktskarakter'
		| 'intern prøve'
		| 'årskarakter'
		| 'eksamens-/årsprøvekarakter'
		| string[]
		| undefined = undefined;

	let karakter = getKarakterFromKind(kind);

	function getKarakterFromKind(kind: string | string[] | undefined) {
		if (!kind) return;
		if (Array.isArray(kind)) {
			for (const k of kind) {
				if (cell?.[k as keyof GradeLine]) return cell[k as keyof GradeLine];
			}
		} else {
			return cell?.[kind as keyof GradeLine];
		}
	}
</script>

{#if renderAs === 'cell' && typeof cell == 'object'}
	<div class="flex flex-col items-center justify-center {karakter === '12' ? 'text-green-500' : ''}">
		<p class="text-center">{karakter || ''}</p>
		{#if karakter}
			<p class="text-xs text-center opacity-50">
				{parseFloat(cell?.vægtning.replace(',', '.') || '1').toFixed(2)}
			</p>
		{/if}
	</div>
{:else if renderAs === 'subject' && typeof cell == 'object'}
	<div class="flex flex-col items-start justify-center max-w-fit">
		<p class="text-xs line-clamp-2">{cell?.fag}</p>
		<p class="text-xs opacity-50">
			{cell?.evalueringsform === 'Samlet vurdering' ? 'Samlet' : cell?.evalueringsform}
		</p>
	</div>
{:else}
	<p></p>
{/if}
