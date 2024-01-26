<script lang="ts">
	import { goto } from "$app/navigation";
    import Header from "$lib/customComponents/Header.svelte";
    import { get } from '$lib/js/http';
    import { beskeder } from '$lib/js/store';
    import Spinner from "$lib/customComponents/spinner.svelte";
	import Separator from "$lib/components/ui/separator/separator.svelte";
    import LectioAvatar from "$lib/customComponents/LectioAvatar.svelte";
    

    type Besked = {
        emne: string;
        førsteBesked: string;
        message_id: string;
        modtagere: string[];
        senesteBesked: string;
        ændret: string;
    };

    let ready = false;
    get('/beskeder').then((res) => {
        $beskeder = res.beskeder;
        ready = true;
    });
</script>

<Header>Nyeste beskeder</Header>

{#if ready}
     <div class="container mx-auto">
        {#each $beskeder as besked}
        <a class="w-full flex flex-row cursor-pointer" href="/besked?id={besked.message_id}">
            <LectioAvatar navn={besked.førsteBesked} id={""} /> <!-- TODO få billeder til at virke-->
            <div class="flex flex-col ml-2">
                <div class="flex flex-row">
                    <div class="font-bold">{besked.førsteBesked}</div>
                    <div class="ml-2 text-gray-500">{besked.ændret}</div>
                </div>
                <div>{besked.emne}</div>
            </div>
        </a>
        <Separator class="my-2"/>
        {/each}
     </div>
{:else}
    <div class="absolute right-1/2 top-1/2 transform translate-x-1/2 -translate-y-1/2">
        <Spinner />
    </div>
{/if}