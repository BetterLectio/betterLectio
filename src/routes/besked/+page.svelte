<script lang="ts">
    import { api, get } from '$lib/js/http.js';
	import Header from '$lib/customComponents/Header.svelte';
    import ChatBubble from '$lib/customComponents/ChatBubble.svelte';

    const beskedId = new URLSearchParams(window.location.search).get('id');

    let beskedChain: any = null; // TODO (chore): ADD TYPES
    let beskedModtagere = null;
    let ready: boolean = false;

    get(`/besked?id=${beskedId}`).then((res) => {
        beskedChain = res.beskeder;
        beskedModtagere = res.modtagere;
        console.log(res);
        ready = true;
    });
    
</script>

{#if ready}
     <Header>{beskedChain[0].titel}</Header>
{:else}
    <Header>Henter besked...</Header>
{/if}


<div class="container mx-auto">
    {#if ready}
        {#each beskedChain as besked}
            <ChatBubble besked={besked.besked} afsender={besked.bruger.navn} dato={besked.dato} indent={besked.padding_left} />
        {/each}
    {/if}
</div>