<script lang="ts">
	import AbsenceBlock from '$lib/components/AbsenceBlock.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
</script>

<div class="page-container">
	<h1>Fravær</h1>

	<div class="flex gap-2 *:w-full">
		<AbsenceBlock variant="opgjort" />
		<AbsenceBlock variant="forÅret" />
	</div>

	<Separator />
</div>

<!--
	til resten bruges:
	https://unovis.dev/docs/misc/Donut

	det burde virke med svelte ret lækkert

	vi skal også lige lave fraværsårsag på api'en

-->
