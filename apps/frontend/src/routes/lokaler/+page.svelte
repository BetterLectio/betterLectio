<script lang="ts">
  import RoomRenderer from '$lib/components/lectio/RoomRenderer.svelte';
  import Input from '$lib/components/ui/input/input.svelte';
  import { roomsStore } from '$lib/stores';
  import type { Rooms } from '$lib/types/rooms';
  import fuzzy from 'fuzzy';
  import { onMount } from 'svelte';

  let loading = true;
  let searchString = '';

  let filteredRooms: Rooms = [];

  onMount(async () => {
    await roomsStore.fetch();
    loading = false;
  });

  $: {
    if (!loading) {
      filteredRooms = fuzzy
        .filter(searchString, $roomsStore, { extract: (room) => room.navn })
        .map((result) => result.original);
    }
  }
</script>

<div class="page-container">
  <h1>Lokaler</h1>

  <div>
    <Input placeholder="Søg efter lokaler (f.eks. teori)" bind:value={searchString} />
  </div>

  <div class="flex flex-col gap-2">
    {#if loading}
      <p>loading...</p>
    {:else}
      {#each filteredRooms as room (room)}
        <RoomRenderer {room} />
      {/each}
    {/if}
  </div>
</div>
