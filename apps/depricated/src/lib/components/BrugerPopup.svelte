<script>
	import BrugerPopupWindow from '$lib/components/BrugerPopupWindow.svelte';

	export let navn = null;
	export let id = null;

	let show = false;
</script>

<div class="dropdown">
	<button
		on:click={() => {
			show = true;
		}}
		tabindex="0"
		class="hover:underline"
	>
		<slot />
	</button>

	<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
	<div tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box">
		{#if show}
			<svelte:component this={BrugerPopupWindow} {navn} {id} />
		{:else}
			<div class="btn btn-ghost">Indlæser<span class="loading" /></div>
		{/if}
	</div>
</div>
