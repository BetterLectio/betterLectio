<script lang="ts">
	import { screenSizeStore } from '$lib/stores';

	let width = window.innerWidth;
	let height = window.innerHeight;

	$: screenSizeStore.set({ width, height });
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />
