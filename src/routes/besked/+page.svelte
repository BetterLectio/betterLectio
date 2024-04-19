<script lang="ts">
	import { Spinner } from '$lib/components';
	import { get } from '$lib/js/http.js';
	import ChatBubble from './_components/ChatBubble.svelte';

	const beskedId = new URLSearchParams(window.location.search).get('id');

	let beskedChain: any = null; // TODO (chore): ADD TYPES
	let ready: boolean = false;

	get(`/besked?id=${beskedId}`).then((res) => {
		beskedChain = res.beskeder;
		ready = true;
	});
</script>

<div class="page-container">
	{#if !ready}
		<div class="flex space-x-2">
			<h1>Henter besked...</h1>
			<Spinner />
		</div>
	{:else}
		<h1>{beskedChain[0].titel}</h1>
		{#each beskedChain as besked}
			<ChatBubble
				besked={besked.besked}
				afsender={besked.bruger.navn}
				dato={besked.dato}
				indent={besked.padding_left}
			/>
		{/each}
	{/if}
</div>
