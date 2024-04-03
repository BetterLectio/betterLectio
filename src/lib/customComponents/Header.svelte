<script lang="ts">
	import { Separator } from '$lib/components/ui/separator';
	import { ArrowLeft as Back } from 'radix-icons-svelte';

	function goBack() {
		window.history.back();
	}
</script>

<div class="container mx-auto flex items-center gap-4">
	<div role="button" tabindex="0" on:click={goBack} on:keydown={goBack} aria-label="Tilbage">
		<Back class="w-8 h-8" />
	</div>
	<h3 class="scroll-m-20 text-2xl font-semibold tracking-tight"><slot>Untitled page</slot></h3>
</div>
<Separator class="mb-4 mt-1" />
